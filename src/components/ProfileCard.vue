<template>
    <div class="profile-card">
        <div class="avatar-upload">
            <img src="https://via.placeholder.com/150" id="avatarPreview" alt="头像">
            <label class="upload-btn">
                选择头像
                <input type="file" accept="image/*" @change="previewAvatar">
            </label>
        </div>

        <form class="profile-form">
            <div class="form-group">
                <label>用户ID</label>
                <input type="text" id="userId" value="demo_user" disabled>
            </div>
            <div class="form-group">
                <label>昵称</label>
                <input type="text" id="nickname" placeholder="请输入昵称" value="小羽毛">
            </div>
            <div class="form-group">
                <label>状态</label>
                <select id="status">
                    <option>在线</option>
                    <option>忙碌</option>
                    <option>离开</option>
                </select>
            </div>
            <button type="submit" class="save-btn">保存修改</button>
        </form>
    </div>
</template>

<script setup>
const previewAvatar = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            document.getElementById('avatarPreview').src = reader.result;
        };
        reader.readAsDataURL(file);
    }
}
</script>

<style scoped>
.profile-card {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-upload {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.upload-btn {
    background: #00796b;
    color: white;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
    font-size: 14px;
}

.upload-btn input {
    display: none;
}

.profile-form {
    display: flex;
    flex-direction: column;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    font-weight: bold;
}

.form-group input,
.form-group select {
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.save-btn {
    background: #00796b;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}
</style>
