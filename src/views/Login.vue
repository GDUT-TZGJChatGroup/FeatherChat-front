<template>
    <div class="login-container">
        <div class="brand">FeatherChat 🪶</div>
        <div class="form-container">
            <form :class="['form', { active: isLoginForm }]" @submit.prevent="handleLogin">
                <h2>登录</h2>
                <input v-model="loginId" type="text" placeholder="用户ID" required />
                <input v-model="loginPass" type="password" placeholder="密码" required />
                <button type="submit">登录</button>
                <p class="switch-text">
                    新用户？<a href="#" @click.prevent="toggleForm">注册</a>
                </p>
            </form>
            <form :class="['form', { active: !isLoginForm }]" @submit.prevent="handleRegister">
                <h2>注册</h2>
                <input v-model="regId" type="text" placeholder="用户ID" required />
                <input v-model="regPass" type="password" placeholder="密码" required />
                <input v-model="confirmPass" type="password" placeholder="确认密码" required />
                <!-- 新增邮箱输入框 -->
                <input v-model="regEmail" type="email" placeholder="邮箱" required />
                <!-- 新增验证码输入框和发送按钮 -->
                <div class="captcha-group">
                    <input v-model="captchaInput" type="text" placeholder="输入验证码" required />
                    <button type="button" @click="sendCaptchaHandler" :disabled="isSendingCaptcha || countdown > 0">
                        {{ countdown > 0 ? `${countdown}s后重试` : '发送验证码' }}
                    </button>
                </div>
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
import { sendEmailCaptcha, userRegister, userLogin } from '../api/userApi'

const router = useRouter()
const isLoginForm = ref(true)
const loginId = ref('')
const loginPass = ref('')
const regId = ref('')
const regPass = ref('')
const confirmPass = ref('')
const regEmail = ref('')
const captchaInput = ref('')
const isSendingCaptcha = ref(false)
const countdown = ref(0)

// 发送验证码
const sendCaptchaHandler = async () => {
    const email = regEmail.value.trim();
    if (!email) {
        alert('请输入邮箱');
        return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        alert('请输入有效的邮箱地址');
        return;
    }

    isSendingCaptcha.value = true;
    try {
        const response = await sendEmailCaptcha(email);
        if (response.status === 200) {
            alert('验证码已发送到您的邮箱，请查收');
            countdown.value = 60;
            const timer = setInterval(() => {
                if (countdown.value > 0) {
                    countdown.value--;
                } else {
                    clearInterval(timer);
                }
            }, 1000);
        } else {
            alert('验证码发送失败，请稍后重试');
        }
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            if (status === 400) {
                alert(data.msg || '用户请求错误，请检查输入');
            } else if (status === 401) {
                alert('身份验证错误，请重新登录');
            } else {
                alert('验证码发送失败，请稍后重试');
            }
        } else {
            alert('网络错误，请检查网络连接');
        }
        console.error('验证码发送失败:', error);
    } finally {
        isSendingCaptcha.value = false;
    }
};

const toggleForm = () => {
    isLoginForm.value = !isLoginForm.value;
};

const handleRegister = async () => {
    const userAccount = regId.value.trim();
    const userPassword = regPass.value;
    const checkPassword = confirmPass.value;
    const email = regEmail.value.trim();
    const code = captchaInput.value.trim();

    if (!userAccount || !userPassword || !checkPassword || !email || !code) {
        alert('请填写所有字段');
        return;
    }

    if (userPassword.length < 6) {
        alert('密码需至少6个字符');
        return;
    }

    if (userPassword !== checkPassword) {
        alert('两次输入密码不一致');
        return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        alert('请输入有效的邮箱地址');
        return;
    }

    try {
        const response = await userRegister({
            userAccount,
            userPassword,
            checkPassword,
            email,
            code
        });
        const { code: responseCode, msg } = response.data;
        if (responseCode === 200) {
            alert('注册成功！请登录');
            toggleForm();
        } else {
            alert(msg || '注册失败，请稍后重试');
        }
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            if (status === 400) {
                alert(data.msg || '用户请求错误，请检查输入');
            } else if (status === 401) {
                alert('身份验证错误，请重新登录');
            } else {
                alert('注册失败，请稍后重试');
            }
        } else {
            alert('网络错误，请检查网络连接');
        }
        console.error('注册失败:', error);
    }
};

const handleLogin = async () => {
    const userAccount = loginId.value.trim();
    const userPassword = loginPass.value;

    if (!userAccount || !userPassword) {
        alert('请输入用户名和密码');
        return;
    }

    try {
        const response = await userLogin({ userAccount, userPassword });
        const { code: responseCode, msg, data } = response.data;
        if (responseCode === 200) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.id);
            localStorage.setItem('userAccount', userAccount);
            alert(`欢迎回来，${userAccount}！`);
            router.push('/friends'); // 跳转到好友页
        } else {
            alert(msg || '登录失败，请稍后重试');
        }
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            if (status === 400) {
                alert(data.msg || '用户请求错误，请检查输入');
            } else if (status === 401) {
                alert('身份验证错误，请重新登录');
            } else {
                alert('登录失败，请稍后重试');
            }
        } else {
            alert('网络错误，请检查网络连接');
        }
        console.error('登录失败:', error);
    }
};
</script>

<style scoped>
.captcha-group {
    display: flex;
    gap: 10px;
}

.captcha-group input {
    flex: 2;
}

.captcha-group button {
    flex: 1;
}
</style>