<template>
    <li>
        <div class="friend-info">
            <span class="friend-name">{{ friend.account }}</span>
        </div>
        <div class="actions">
            <button class="chat-btn" @click="handleChat">对话</button>
            <button class="remove-btn" @click="handleDelete" :disabled="isDeleting">
                {{ isDeleting ? '删除中...' : '删除' }}
            </button>
        </div>
    </li>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// 定义接收的prop
const props = defineProps({
    friend: {
        type: Object,
        required: true
    },
    isDeleting: {
        type: Boolean,
        default: false
    }
});

// 定义触发的事件
const emits = defineEmits(['chat', 'delete'])

// 触发对话事件，传递完整的好友对象
const handleChat = () => {
    emits('chat', props.friend)
}

// 触发删除事件
const handleDelete = () => {
    if (confirm('确定要删除该好友吗？')) {
        emits('delete', props.friend.account)
    }
}
</script>

<style scoped>
.actions {
    display: flex;
    gap: 5px;
}

.remove-btn {
    padding: 5px 10px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.remove-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.chat-btn {
    background: #e0f7fa;
    color: #00796b;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
}
</style>
