<template>
    <nav class="sidebar">
        <div class="brand">🪶 FeatherChat</div>
        <ul>
            <!-- 移除聊天页面的导航链接 -->
            <!-- <li>
                <router-link to="/chat" :class="{ active: $route.path === '/chat' }">聊天</router-link>
            </li> -->
            <li>
                <router-link to="/friends" :class="{ active: $route.path === '/friends' }">好友</router-link>
            </li>
            <li>
                <router-link to="/login">退出</router-link>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { onMounted } from 'vue'

// 调试：确认 Sidebar 组件渲染
onMounted(() => {
    console.log('Sidebar rendered, .brand element should be visible')
})
</script>

<style scoped>
/* 提高 .brand 样式优先级，确保不被覆盖 */
.brand {
    display: block !important;
    font-size: 1.5rem !important;
    font-weight: bold !important;
    margin-bottom: 30px !important;
    text-align: center !important;
    color: white !important;
}
</style>