<template>
    <nav class="sidebar">
        <div class="brand">🪶 FeatherChat</div>
        <!-- 增强型账号展示 -->
        <div class="user-card">
            <div class="user-info">
                <div class="username">{{ userAccount }}</div>
            </div>
        </div>

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
// onMounted(() => {
//     console.log('Sidebar rendered, .brand element should be visible')
// })
</script>

<style scoped>
.user-account {
    text-align: center;
    margin: 10px 0 20px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
}

.user-card {
    display: block;
    padding: 18px 15px;
    margin: 15px;
    background: rgba(255, 255, 255, 0.08);
    /* 改为半透明背景更协调 */
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
}

.user-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.user-avatar {
    width: 40px;
    height: 40px;
    background: #00796b;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    flex-shrink: 0;
}

.avatar-text {
    color: white;
    font-weight: bold;
    text-transform: uppercase;
}

.user-info {
    text-align: center;
    /* 内容居中显示 */
}

.username {
    font-size: 1rem;
    /* 增大用户名文字大小 */
    font-weight: 600;
    /* 加粗文字 */
    color: #ffffff;
    margin-bottom: 4px;
}
</style>