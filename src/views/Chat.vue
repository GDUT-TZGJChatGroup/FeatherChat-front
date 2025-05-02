<template>
    <div class="dashboard-container">
        <Sidebar />
        <main class="main-content">
            <ChatContainer />
        </main>
    </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue'
import ChatContainer from '../components/ChatContainer.vue'
</script>

<style scoped></style>