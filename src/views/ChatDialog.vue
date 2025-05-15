<template>
    <div class="dashboard-container">
        <Sidebar />
        <main class="main-content">
            <div class="chat-dialog">
                <div class="chat-header">
                    <button @click="goBack" class="back-button">
                        <i class="fas fa-arrow-left"></i> 返回
                    </button>
                    <h3>{{ friendName }}</h3>
                    <div class="spacer"></div>
                </div>
                <div class="chat-messages">
                    <!-- 消息渲染逻辑 -->
                    <div v-for="msg in chatMessages" :key="msg.time"
                        :class="['message', msg.isMine ? 'mine' : 'friend']">
                        <div class="message-content">
                            {{ msg.content }}
                        </div>
                        <div class="message-time">
                            {{ msg.time }}
                        </div>
                    </div>
                </div>
                <div class="chat-input">
                    <input type="text" v-model="message" placeholder="输入消息">
                    <button @click="sendMessage">发送</button>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import { getChatHistory } from '../api/userApi'

const route = useRoute()
const router = useRouter()
const friendName = ref('')
const message = ref('')
const chatMessages = ref([])
const currentUserId = ref(localStorage.getItem('userId')) // 当前用户ID
const ws = ref(null) // WebSocket实例

// 初始化WebSocket连接
onMounted(async () => {
    // 原有好友信息获取逻辑
    const friendId = route.params.friendId
    const friend = route.params.friend
    if (friend) friendName.value = friend.account
    else friendName.value = `好友${friendId}`

    // 初始化WebSocket（新增）
    const token = localStorage.getItem('token') // 从localStorage获取用户token
    if (!token) {
        alert('未登录，无法建立实时连接')
        return
    }
    const wsUrl = `ws://120.26.40.154:8888/ws/chat?token=${encodeURIComponent(token)}`
    ws.value = new WebSocket(wsUrl)

    // WebSocket事件处理
    ws.value.onopen = () => {
        console.log('WebSocket连接已建立')
    }

    ws.value.onmessage = (event) => {
        const msg = JSON.parse(event.data)
        // 处理接收的消息（回显/对方消息/错误）
        if (msg.error) {
            alert(msg.error) // 显示错误提示（如"对方不是好友"）
        } else {
            // 标记消息是否为当前用户发送（回显消息的fromUserId是当前用户）
            const isMine = msg.fromUserId === currentUserId.value
            chatMessages.value.push({ ...msg, isMine })
        }
    }

    ws.value.onerror = (error) => {
        console.error('WebSocket错误:', error)
        alert('实时通信连接异常，请刷新页面')
    }

    // 聊天记录获取逻辑
    const friendAccount = friend?.account || friendId
    console.log('获取聊天记录:', friendAccount)
    try {
        const response = await getChatHistory(friendAccount)
        if (response.data.code === 200) {
            chatMessages.value = response.data.data.map(m => ({
                ...m,
                isMine: m.fromUserId === currentUserId.value
            }))
        }
    } catch (err) {
        console.error('获取历史记录失败:', err)
    }
})

// 发送消息
const sendMessage = () => {
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
        alert('实时连接未建立，请稍后再试')
        return
    }
    const content = message.value.trim()
    if (!content) return

    // 构造消息对象（需与后端要求的格式一致）
    const msg = {
        fromUserId: currentUserId.value,
        toUserId: route.params.friendId, // 从路由获取好友ID
        content,
        time: new Date().toLocaleString() // 生成当前时间
    }

    // 发送消息
    ws.value.send(JSON.stringify(msg))
    message.value = '' // 清空输入框
}

// 清理连接（新增）
onBeforeUnmount(() => {
    if (ws.value) {
        ws.value.close()
        ws.value = null
    }
})

// 原有返回逻辑（保持不变）
const goBack = () => {
    router.push('/friends')
}
</script>

<style scoped>
/* 聊天消息区域背景设为白色 */
.chat-messages {
    height: calc(100vh - 200px);
    /* 根据实际调整高度 */
    overflow-y: auto;
    background-color: white;
    /* 关键修改：背景白色 */
    padding: 20px;
}

/* 输入框固定底部中间（调整最大宽度避免溢出） */
.chat-input {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    /* 小屏幕适配 */
    max-width: calc(100vw - 220px - 40px);
    /* 关键调整：视口宽度 - 侧边栏宽度(220px) - 主内容左右内边距(20px*2) */
    display: flex;
    gap: 10px;
}

.chat-input input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.chat-input button {
    padding: 10px 20px;
    background: #00796b;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
</style>
