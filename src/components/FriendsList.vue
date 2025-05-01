<template>
    <div class="friends-list">
        <h3>好友列表</h3>
        <ul id="friendList">
            <li v-for="friend in friends" :key="friend.id" :class="friend.status">
                <div class="friend-info">
                    <span class="status-indicator"></span>
                    <span class="friend-name">{{ friend.name }}</span>
                </div>
                <button class="chat-btn" @click="selectFriend(friend)">对话</button>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const friends = ref([
    { id: 1, name: '✨ 小明', status: 'online' },
    { id: 2, name: '🌙 小红', status: 'offline' }
])

const emit = defineEmits(['select-friend'])

const selectFriend = (friend) => {
    friends.value.forEach(f => (f.status = f.id === friend.id ? 'online' : f.status))
    emit('select-friend', friend)
}
</script>

<style scoped></style>