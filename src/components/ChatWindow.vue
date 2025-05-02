<template>
    <div class="chat-window">
        <div class="chat-header">
            <h3>{{ currentFriend ? currentFriend.name : '选择好友开始聊天' }}</h3>
            <span :class="['status-indicator', currentFriend && currentFriend.status]"></span>
        </div>
        <div class="messages" ref="messagesContainer">
            <div v-for="message in messages" :key="message.id" :class="['message', message.type]">
                <img src="https://via.placeholder.com/30" class="avatar" />
                <div class="content">{{ message.content }}</div>
            </div>
        </div>
        <form class="message-form" @submit.prevent="sendMessage">
            <input type="file" accept="image/*" @change="handleImageUpload" :disabled="!currentFriend" />
            <input v-model="messageInput" type="text" placeholder="输入消息..." :disabled="!currentFriend" />
            <button type="submit" :disabled="!currentFriend">发送</button>
        </form>
    </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

defineProps(['currentFriend'])

const messageInput = ref('')
const messages = ref([
    { id: 1, type: 'received', content: '你好呀！' }
])
const messagesContainer = ref(null)

const sendMessage = () => {
    if (messageInput.value.trim()) {
        messages.value.push({
            id: messages.value.length + 1,
            type: 'sent',
            content: messageInput.value
        })
        messageInput.value = ''
        scrollToBottom()
    }
}

const handleImageUpload = (event) => {
    if (event.target.files.length > 0) {
        messages.value.push({
            id: messages.value.length + 1,
            type: 'sent',
            content: '[图片]'
        })
        scrollToBottom()
    }
}

const scrollToBottom = () => {
    nextTick(() => {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    })
}

// 模拟接收消息
setInterval(() => {
    if (Math.random() > 0.8) {
        messages.value.push({
            id: messages.value.length + 1,
            type: 'received',
            content: '收到新消息'
        })
        scrollToBottom()
    }
}, 5000)

watch(() => messages.value, () => {
    scrollToBottom()
}, { deep: true })
</script>

<style scoped></style>