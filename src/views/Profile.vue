<template>
    <div class="dashboard-container">
        <Sidebar />
        <main class="main-content">
            <div class="profile-card">
                <div class="avatar-upload">
                    <img :src="avatarPreview" id="avatarPreview" alt="头像" />
                    <label class="upload-btn">
                        选择头像
                        <input type="file" accept="image/*" @change="previewAvatar" />
                    </label>
                </div>
                <form class="profile-form" @submit.prevent="saveProfile">
                    <div class="form-group">
                        <label>用户ID</label>
                        <input type="text" value="demo_user" disabled />
                    </div>
                    <div class="form-group">
                        <label>昵称</label>
                        <input v-model="nickname" type="text" placeholder="请输入昵称" />
                    </div>
                    <div class="form-group">
                        <label>状态</label>
                        <select v-model="status">
                            <option>在线</option>
                            <option>忙碌</option>
                            <option>离开</option>
                        </select>
                    </div>
                    <button type="submit" class="save-btn">保存修改</button>
                </form>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'

const avatarPreview = ref('https://via.placeholder.com/150')
const nickname = ref('小羽毛')
const status = ref('在线')

const previewAvatar = (event) => {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            avatarPreview.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

const saveProfile = () => {
    alert('个人信息已保存！')
}
</script>

<style scoped></style>