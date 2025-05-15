<template>
    <div class="friends-list">
        <h3>好友列表</h3>
        <ul id="friendList">
            <li v-for="friend in friends" :key="friend.id">
                <div class="friend-info">
                    <span class="friend-name">{{ friend.name }}</span>
                </div>
                <button class="chat-btn" @click="selectFriend(friend)">对话</button>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const friends = ref([])
const emit = defineEmits(['select-friend'])

const selectFriend = (friend) => {
    emit('select-friend', friend)
}
</script>

<style scoped></style>