import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/Login.vue'
import Friends from './views/Friends.vue'
import ChatDialog from './views/ChatDialog.vue' // 引入对话框组件

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/friends', component: Friends },
    { path: '/chat-dialog/:friendId', component: ChatDialog } // 添加对话框路由
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router