import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/Login.vue'
import Chat from './views/Chat.vue'
import Friends from './views/Friends.vue'
import Profile from './views/Profile.vue'

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/chat', component: Chat },
    { path: '/friends', component: Friends },
    { path: '/profile', component: Profile }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router