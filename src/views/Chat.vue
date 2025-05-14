<template>
    <div class="dashboard-container">
        <Sidebar />
        <main class="main-content">
            <div class="chat-container">
                <div class="friends-list">
                    <h3>在线好友 ({{friends.filter(friend => friend.status === 'online').length}})</h3>
                    <ul>
                        <!-- 只渲染在线好友 -->
                        <li v-for="friend in friends.filter(friend => friend.status === 'online')" :key="friend.id"
                            :class="friend.status" @click="selectFriend(friend)">
                            <span class="status-indicator"></span>
                            <span>{{ friend.name }}</span>
                        </li>
                    </ul>
                </div>
                <div class="chat-window" v-if="selectedFriend">
                    <div class="chat-header">
                        <h3>与 {{ selectedFriend.name }} 聊天</h3>
                        <span class="status-indicator" :class="selectedFriend.status"></span>
                    </div>
                    <div class="messages" ref="messagesContainer">
                        <div v-for="(message, index) in messages" :key="index" class="message"
                            :class="{ sent: message.sender === 'me', received: message.sender !== 'me' }">
                            <img :src="message.sender === 'me' ? myAvatar : selectedFriendAvatar" class="avatar"
                                alt="头像" />
                            <div class="content">
                                <span v-if="message.type === 'text'">{{ message.text }}</span>
                                <img v-if="message.type === 'image'" :src="message.src" alt="上传的图片"
                                    style="max-width: 200px; border-radius: 10px;" />
                            </div>
                        </div>
                    </div>
                    <div class="message-form">
                        <input type="text" v-model="newMessage" placeholder="输入消息..." />
                        <input type="file" id="imageUpload" @change="handleImageUpload" accept="image/*" hidden />
                        <label for="imageUpload" class="upload-btn" aria-label="上传图片"></label>
                        <button @click="sendMessage">发送</button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import { getFriendList, getChatHistory } from '../api/userApi'

const friends = ref([])
const selectedFriend = ref(null)
const newMessage = ref('')
const messages = ref([])
const messagesContainer = ref(null)
const myAvatar = 'https://via.placeholder.com/30?text=Me'
const selectedFriendAvatar = computed(() => selectedFriend.value ? 'https://via.placeholder.com/30?text=Friend' : '')
const token = localStorage.getItem('token')
const ws = ref(null)

onMounted(async () => {
    try {
        const response = await getFriendList();
        friends.value = response.data.data;
        if (friends.value.length > 0) {
            selectFriend(friends.value[0]);
        }
    } catch (error) {
        console.error('获取好友列表失败:', error);
    }

    // 初始化 WebSocket
    ws.value = new WebSocket(`ws://120.26.40.154:8888/ws/chat?token=${token}`);

    ws.value.onmessage = (event) => {
        const message = JSON.parse(event.data);
        messages.value.push(message);
        scrollToBottom();
    };

    ws.value.onerror = (error) => {
        console.error('WebSocket 错误:', error);
    };
});

onUnmounted(() => {
    if (ws.value) {
        ws.value.close();
    }
});

const selectFriend = async (friend) => {
    selectedFriend.value = friend;
    messages.value = [];
    try {
        const response = await getChatHistory(friend.account);
        messages.value = response.data.data;
    } catch (error) {
        console.error('获取聊天记录失败:', error);
    }
    friend.status = 'online';
};

const scrollToBottom = () => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
};

const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            if (ws.value && ws.value.readyState === WebSocket.OPEN) {
                const message = {
                    fromUserId: JSON.parse(localStorage.getItem('userInfo')).id,
                    toUserId: selectedFriend.value.id,
                    content: e.target.result,
                    type: 'image'
                };
                ws.value.send(JSON.stringify(message));
            }
            scrollToBottom()
        }
        reader.readAsDataURL(file)
    }
};

const sendMessage = () => {
    if (!newMessage.value.trim()) return

    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
        const message = {
            fromUserId: JSON.parse(localStorage.getItem('userInfo')).id,
            toUserId: selectedFriend.value.id,
            content: newMessage.value,
            type: 'text'
        };
        ws.value.send(JSON.stringify(message));
    }

    newMessage.value = ''
    scrollToBottom()
};
</script>

<style scoped></style>