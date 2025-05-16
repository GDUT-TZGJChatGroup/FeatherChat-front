<template>
    <div class="container">
        <Sidebar />
        <main>
            <div class="dialog-header">
                <button class="back-button" @click="goBack">
                    <i class="icon-back"></i> 返回
                </button>
                <h2 class="dialog-header-title">{{ friendName }}</h2>
                <!-- <button @click="testfunc">测试按钮</button> -->
            </div>
            <div class="dialog-box">
                <ul>
                    <template v-for="data in datas">
                        <DialogLine v-if="data.fromUserId == userId" :content="data.content" class="receive" />
                        <DialogLine v-if="data.fromUserId != userId" :content="data.content" class="send" />
                    </template>
                </ul>
            </div>
            <InputBox @send-message="sendContentPar" />
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Sidebar from '../components/Sidebar.vue'
import DialogLine from '../components/Chat/DialogLine.vue'
import InputBox from '../components/Chat/InputBox.vue'
import { getChatHistory } from '../api/userApi';


const token = localStorage.getItem('token')
const route = useRoute()
const router = useRouter()
const userId = ref(localStorage.getItem('userId'))
const userAccount = ref(localStorage.getItem('userAccount'))
const friendName = ref(route.query.friendName)
const friendId = ref(route.query.friendId)

let datas = ref([])
let ws = ref(null)

onMounted(async () => {
    if (!token) {
        router.push('\login')
        return
    }else if(!userId||!userAccount||!friendId.value||!friendName.value){
        router.push('\login')
        return
    }
    try {
        const response = await getChatHistory(friendName.value)

        if (response.data.code === 200) {
            console.log("接收到历史数据,id=" + friendId.value)
            datas.value = response.data.data
            nextTick(()=>{
                const chatBox = document.querySelector(".dialog-box")
                chatBox.scrollTop = chatBox.scrollHeight
            })
        }
    } catch (err) {
        alert(err)
    }


    const wsUrl = `ws://47.76.251.80:8888/ws/chat?token=${encodeURIComponent(token)}`
    ws = new WebSocket(wsUrl)
    ws.onopen = () => {
        console.log("websocket open")
    }
    ws.onmessage = (evt) => {
        console.log(evt)
        datas.value.push(JSON.parse(evt.data))
        console.log(datas.value)
    }
    ws.onerror = (err) => {
        console.log(err)
    }
    ws.onclose = () => {
        console.log("websocket close")
    }

})


function sendContentPar(Ccontent) {
    var currentTime = new Date().toLocaleString()

    var myDate = new Date((new Date).getTime() + 8 * 60 * 60 * 1000);
    var sendTime = myDate.toJSON().split('T').join(' ').substring(0, 16)
    console.log(sendTime)
    ws.send(JSON.stringify({
        fromUserId: userId.value,
        toUserId: friendId.value,
        content: Ccontent,
        time: sendTime
    }))
    console.log(JSON.stringify({
        fromUserId: userId.value,
        toUserId: friendId.value,
        content: Ccontent,
        time: sendTime
    }))
}

// 添加返回方法
const goBack = () => {
    router.go(-1) // 或 router.push('/friends') 直接跳转好友页
}

const testfunc = async()=>{
    console.log([
        userId.value,userAccount.value,friendName.value,friendId.value
    ])
}

</script>

<style scoped>
.container {
    display: flex;
    width: 100vw;
    height: 100vh;
}

main {
    width: 100%;
    background-color: white;
}

.dialog-header {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    /* 左对齐 */
    border-bottom: 1px solid #cccccc;
    padding: 0 20px;
    /* 增加内边距 */
    gap: 15px;
    /* 按钮与名称间距 */
}

/* 可选：调整返回按钮文字大小（如果需要） */
.back-button {
    font-size: 14px;
    padding: 6px 12px;
}


/* 新增名称居中样式 */
.dialog-header-title {
    margin: 0 auto;
    /* 自动分配左右边距实现居中 */
}

.dialog-box {
    width: 100%;
    height: calc(100% - 250px);
    overflow-y: scroll;
}
</style>