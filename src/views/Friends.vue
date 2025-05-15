<template>
    <div class="dashboard-container">
        <Sidebar />
        <main class="main-content">
            <div class="friends-container">
                <h2>好友管理</h2>
                <!-- 添加好友区域 -->
                <div class="add-friend">
                    <input v-model="newFriendId" type="text" placeholder="输入好友ID" />
                    <button @click="addFriend" :disabled="isAddingFriend">
                        {{ isAddingFriend ? '发送中...' : '添加好友' }}
                    </button>
                </div>

                <!-- 好友请求列表 -->
                <div class="friend-requests">
                    <h3>好友请求 ({{ friendRequests.length }})</h3>
                    <div v-if="isLoadingRequests">加载中...</div>
                    <div v-else-if="errorRequests" class="error" style="color: red;">{{ errorRequests }}</div>
                    <ul v-else>
                        <li v-for="request in friendRequests" :key="request.id" class="request-item">
                            <span>{{ request.account }} 申请添加你为好友</span>
                            <button @click="agreeRequest(request.account)" :disabled="isAgreeing === request.account">
                                {{ isAgreeing === request.account ? '处理中...' : '同意' }}
                            </button>
                        </li>
                    </ul>
                </div>

                <!-- 好友列表 -->
                <div class="friends-list">
                    <h3>我的好友 ({{ friends.length }})</h3>
                    <div v-if="isLoading">加载中...</div>
                    <div v-else-if="error" class="error" style="color: red;">{{ error }}</div>
                    <ul v-else id="friendList">
                        <!-- 使用FriendItem组件循环渲染好友 -->
                        <FriendItem v-for="friend in friends" :key="friend.id" :friend="friend"
                            :is-deleting="isDeleting === friend.account" @chat="goToChatDialog"
                            @delete="handleFriendDelete" />
                    </ul>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getFriendList, sendFriendRequest, getFriendRequestList, agreeFriendRequest, deleteFriend } from '../api/userApi'
import Sidebar from '../components/Sidebar.vue'
import FriendItem from '../components/FriendItem.vue' // 引入新组件

const router = useRouter()
const newFriendId = ref('')
const friends = ref([])
const isLoading = ref(false)
const error = ref(null)
const isAddingFriend = ref(false)
const friendRequests = ref([])
const isLoadingRequests = ref(false)
const errorRequests = ref(null)
const isAgreeing = ref(null)
const isDeleting = ref(null) // 记录当前正在删除的好友账号

// 处理好友删除事件
const handleFriendDelete = async (accountName) => {
    isDeleting.value = accountName // 标记为删除中
    try {
        const response = await deleteFriend(accountName)
        if (response.data.code === 200) {
            alert('好友删除成功！')
            await fetchData() // 刷新好友列表
        } else {
            alert(response.data.msg || '删除好友失败')
        }
    } catch (err) {
        alert('网络错误，请检查连接')
        console.error('删除好友失败:', err)
    } finally {
        isDeleting.value = null // 重置删除状态
    }
}

// 统一数据获取函数（保持）
const fetchData = async () => {
    // 获取好友列表
    isLoading.value = true;
    error.value = null;
    try {
        const friendListRes = await getFriendList();
        if (friendListRes.data.code === 200) {
            friends.value = friendListRes.data.data;
        } else {
            error.value = friendListRes.data.msg || '获取好友列表失败';
        }
    } catch (err) {
        error.value = '网络错误，无法获取好友列表';
        console.error('获取好友列表失败:', err);
    } finally {
        isLoading.value = false;
    }

    // 获取好友请求列表
    isLoadingRequests.value = true;
    errorRequests.value = null;
    try {
        const requestListRes = await getFriendRequestList();
        if (requestListRes.data.code === 200) {
            friendRequests.value = requestListRes.data.data;
            console.log('好友请求列表:', friendRequests.value); // 调试输出
        } else {
            errorRequests.value = requestListRes.data.msg || '获取好友请求失败';
        }
    } catch (err) {
        errorRequests.value = '网络错误，无法获取好友请求';
        console.error('获取好友请求失败:', err);
    } finally {
        isLoadingRequests.value = false;
    }
};


// 挂载时调用统一数据获取函数（保持不变）
onMounted(fetchData)

// 添加好友
const addFriend = async () => {
    const targetAccount = newFriendId.value.trim();
    // 输入验证
    if (!targetAccount) {
        alert('请输入好友ID');
        return;
    }

    isAddingFriend.value = true; // 标记为发送中，禁用按钮
    try {
        // 调用添加好友接口
        const response = await sendFriendRequest(targetAccount);
        if (response.data.code === 200) {
            alert('好友请求发送成功！');
            newFriendId.value = ''; // 清空输入框
            await fetchData(); // 刷新好友请求列表
        } else {
            alert(response.data.msg || '添加失败：未知错误');
        }
    } catch (err) {
        alert('网络异常，请检查网络连接');
        console.error('添加好友失败:', err);
    } finally {
        isAddingFriend.value = false; // 重置发送状态
    }
};

// 同意好友请求
const agreeRequest = async (accountName) => {
    if (!accountName) {
        alert('无效的好友请求');
        return;
    }

    isAgreeing.value = accountName;

    try {
        const response = await agreeFriendRequest(accountName);
        if (response.data.code === 200) {
            alert('已成功同意好友请求！');
            await fetchData(); // 刷新好友和请求列表
        } else {
            alert(response.data.msg || '同意请求失败，请稍后再试');
        }
    } catch (err) {
        alert('网络错误，请检查连接');
        console.error('同意好友请求失败:', err);
    } finally {
        isAgreeing.value = null;
    }
};
// 跳转到聊天对话框
const goToChatDialog = (friend) => {
    const friendId = friend.id;
    if (!friendId) {
        alert('无法打开对话：好友ID无效');
        return;
    }

    router.push({
        path: `/chat-dialog/${friend.id}`,
        params: { friend }
    });
};

</script>

<style scoped>
.friend-requests {
    margin-top: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    padding: 15px 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.friend-requests h3 {
    font-size: 1.2rem;
    color: #00796b;
    margin-bottom: 10px;
}

/* 每个请求项 */
.request-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    margin-bottom: 10px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
    transition: all 0.3s ease;
}

.request-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 请求文字部分 */
.request-item span {
    font-size: 0.95rem;
    color: #333;
    flex: 1;
    margin-right: 10px;
}

/* 同意按钮样式 */
.request-item button {
    padding: 6px 14px;
    font-size: 0.85rem;
    background-color: #00796b;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.request-item button:hover {
    background-color: #004d40;
}

.request-item button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>