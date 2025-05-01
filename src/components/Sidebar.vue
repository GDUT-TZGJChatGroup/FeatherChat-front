<template>
    <nav class="sidebar">
        <div class="brand">🪶 FeatherChat</div>
        <ul>
            <li>
                <router-link to="/chat" :class="{ active: $route.path === '/chat' }">聊天</router-link>
            </li>
            <li>
                <router-link to="/friends" :class="{ active: $route.path === '/friends' }">好友</router-link>
            </li>
            <li>
                <router-link to="/profile" :class="{ active: $route.path === '/profile' }">我的</router-link>
            </li>
            <li>
                <router-link to="/login">退出</router-link>
            </li>
        </ul>
    </nav>
</template>

<script setup>
</script>

<style scoped></style>