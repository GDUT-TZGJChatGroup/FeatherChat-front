<template>
    <div class="chat-container">
        <FriendsList @select-friend="selectFriend" />
        <ChatWindow :current-friend="currentFriend" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import FriendsList from './FriendsList.vue'
import ChatWindow from './ChatWindow.vue'

const currentFriend = ref(null)

const selectFriend = (friend) => {
    currentFriend.value = friend
}
</script>

<style scoped></style>