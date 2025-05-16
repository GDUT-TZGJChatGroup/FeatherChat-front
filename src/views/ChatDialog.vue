<template>
    <div class="container">
        <Sidebar />
        <main>
            <div class="dialog-header">
            {{ friendName }}
            <button @click="testfunc">测试按钮</button>
            </div>
            <div class="dialog-box">
                <ul>
                    <template v-for="data in datas">
                        <DialogLine 
                            v-if="data.fromUserId == userId" 
                            :content="data.content"
                            class="receive"
                        />
                        <DialogLine v-if="data.fromUserId != userId" :content="data.content" class="send" />
                    </template>
                </ul>
            </div>
            <InputBox @send-message="sendContentPar" />
        </main>
    </div>
</template>

<script setup>
import { ref,onMounted } from 'vue';
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

onMounted(async ()=>{
    if(!token){
        router.push('\login')
    }
    try{
        const response = await getChatHistory(friendName.value)

        if(response.data.code === 200){
            console.log("接收到历史数据,id="+friendId.value)
            console.log(response.data)
            datas.value = response.data.data
            console.log(datas)
        }
    }catch(err){
        alert(err)
    }
    

    const wsUrl = `ws://120.26.40.154:8888/ws/chat?token=${encodeURIComponent(token)}`
    ws = new WebSocket(wsUrl)
    ws.onopen = ()=>{
        console.log("websocket open")
    }
    ws.onmessage = (evt)=>{
        console.log(evt)
        datas.value.push(JSON.parse(evt.data))
        console.log(datas.value)
    }
    ws.onerror = (err)=>{
        console.log(err)
    }
    ws.onclose = ()=>{
        console.log("websocket close")
    }

})


function sendContentPar(Ccontent){
    var currentTime = new Date().toLocaleString()
    
    var myDate = new Date((new Date).getTime() + 8*60*60*1000);
    var sendTime = myDate.toJSON().split('T').join(' ').substring(0,16)
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

const testfunc = async()=>{
    datas.value.push({
        content:'你好',
        toUserId : 7
    })
    console.log(datas.value)
    console.log(userId.value)
}

</script>

<style scoped>
    .container{
        display: flex;
        width: 100vw;
        height: 100vh;
    }
    main{
        width: 100%;
        background-color: white;
    }
    .dialog-header{
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #cccccc;
    }
    .dialog-box{
        width: 100%;
        height: calc(100% - 250px);
        overflow-y: scroll;
    }
</style>
