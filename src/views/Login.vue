<template>
    <div class="login-container">
        <div class="brand">FeatherChat 🪶</div>
        <div class="form-container">
            <form v-if="isLoginForm" class="form active" @submit.prevent="handleLogin">
                <h2>登录</h2>
                <input v-model="loginId" type="text" placeholder="用户ID" required />
                <input v-model="loginPass" type="password" placeholder="密码" required />
                <button type="submit">登录</button>
                <p class="switch-text">
                    新用户？<a href="#" @click.prevent="toggleForm">注册</a>
                </p>
            </form>
            <form v-else class="form active" @submit.prevent="handleRegister">
                <h2>注册</h2>
                <input v-model="regId" type="text" placeholder="用户ID" required />
                <input v-model="regPass" type="password" placeholder="密码" required />
                <input v-model="confirmPass" type="password" placeholder="确认密码" required />
                <button type="submit">注册</button>
                <p class="switch-text">
                    已有账号？<a href="#" @click.prevent="toggleForm">登录</a>
                </p>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoginForm = ref(true)
const loginId = ref('')
const loginPass = ref('')
const regId = ref('')
const regPass = ref('')
const confirmPass = ref('')

const toggleForm = () => {
    isLoginForm.value = !isLoginForm.value
}

const getUsers = () => {
    return JSON.parse(localStorage.getItem('featherchat_users') || '{}')
}

const handleRegister = () => {
    const username = regId.value.trim()
    const password = regPass.value
    const confirmPassword = confirmPass.value

    if (!username || !password || !confirmPassword) {
        alert('请填写所有字段')
        return
    }

    if (password.length < 6) {
        alert('密码需至少6个字符')
        return
    }

    if (password !== confirmPassword) {
        alert('两次输入密码不一致')
        return
    }

    const users = getUsers()
    if (users[username]) {
        alert('该用户名已被占用')
        return
    }

    users[username] = password
    localStorage.setItem('featherchat_users', JSON.stringify(users))
    alert('注册成功！请登录')
    toggleForm()
}

const handleLogin = () => {
    const username = loginId.value.trim()
    const password = loginPass.value

    if (!username || !password) {
        alert('请输入用户名和密码')
        return
    }

    const users = getUsers()
    if (!users[username]) {
        alert('用户不存在，请先注册')
        return
    }

    if (users[username] !== password) {
        alert('密码错误')
        return
    }

    alert(`欢迎回来，${username}！`)
    router.push('/chat')
}
</script>

<style scoped></style>