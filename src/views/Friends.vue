<template>
    <div class="dashboard-container">
        <Sidebar />
        <main class="main-content">
            <div class="friends-container">
                <h2>好友管理</h2>
                <div class="add-friend">
                    <input v-model="newFriendId" type="text" placeholder="输入好友ID" />
                    <button @click="addFriend">添加好友</button>
                </div>
                <div class="friends-list">
                    <h3>我的好友 ({{ friends.length }})</h3>
                    <ul id="friendList">
                        <li v-for="friend in friends" :key="friend.id" :class="friend.status">
                            <div class="friend-info">
                                <span class="status-indicator"></span>
                                <span class="friend-name">{{ friend.name }}</span>
                            </div>
                            <div class="actions">
                                <button class="chat-btn" @click="startChat(friend)">对话</button>
                                <button class="remove-btn" @click="removeFriend(friend)">删除</button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'

const router = useRouter()
const newFriendId = ref('')
const friends = ref([
    { id: 1, name: '✨ 小明', status: 'online' },
    { id: 2, name: '🌙 小红', status: 'offline' }
])

const addFriend = () => {
    const friendId = newFriendId.value.trim()
    if (!friendId) {
        alert('请输入好友ID')
        return
    }

    if (friends.value.some(f => f.name === friendId)) {
        alert('该好友已存在')
        return
    }

    friends.value.push({
        id: friends.value.length + 1,
        name: `👤 ${friendId}`,
        status: 'offline'
    })
    newFriendId.value = ''
}

const removeFriend = (friend) => {
    if (confirm('确定要删除该好友吗？')) {
        friends.value = friends.value.filter(f => f.id !== friend.id)
    }
}

const startChat = (friend) => {
    friends.value.forEach(f => (f.status = f.id === friend.id ? 'online' : f.status))
    router.push('/chat')
}
</script>

<style scoped></style>