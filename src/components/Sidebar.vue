<template>
    <nav class="sidebar">
        <div class="brand">🪶 FeatherChat</div>
        <div class="user-account">{{ userAccount }}</div> <!-- 新增：显示账号 -->
        <ul>
            <li>
                <router-link to="/friends"
                    :class="{ active: $route.path === '/friends' || $route.path.startsWith('/chat-dialog') }">好友</router-link>
            </li>
            <li>
                <router-link to="/login">退出</router-link>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 从localStorage获取用户账号
const userAccount = ref(localStorage.getItem('userAccount') || '')

// 页面刷新时重新获取（可选）
onMounted(() => {
    userAccount.value = localStorage.getItem('userAccount') || ''
})

// 原有调试逻辑
onMounted(() => {
    console.log('Sidebar rendered, .brand element should be visible')
})
</script>

<style scoped>
.user-account {
    text-align: center;
    margin: 10px 0 20px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
}
</style>