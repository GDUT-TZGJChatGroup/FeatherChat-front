import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/Login.vue'
// import Chat from './views/chat.vue'
import Friends from './views/Friends.vue'

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    // { path: '/chat', component: Chat },
    { path: '/friends', component: Friends },
    // 移除“我的”页面的路由
    // { path: '/profile', component: Profile }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router