<template>
    <div class="dialog-input">
        <div class="dialog-input-area">
            <textarea v-model="toSendContent" @keyup.enter="cleanInput" @keydown.enter="sendContent"></textarea>
        </div>
        <div class="dialog-input-button">
            <button type="button" @click="sendContent" >
                发送
            </button>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['sendMessage'])
const toSendContent = defineModel()

let isSendingMessage = false

function cleanInput(){
    toSendContent.value = ''
    isSendingMessage = false
}

function sendContent(){
    if(isSendingMessage){
        toSendContent.value = ''
        return
    }
    emit('sendMessage',toSendContent.value)
    isSendingMessage = true
    toSendContent.value = ''
}
</script>

<style scoped>
    .dialog-input div{
        box-sizing: border-box;
    }
    
    .dialog-input{
        box-sizing: border-box;
        border-top: 1px solid #cccccc;
        width: 100%;
        height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .dialog-input>div{
        width: 100%;
    }


    .dialog-input-area{
        width: 100%;
        height: 150px;
    }

    .dialog-input-area>textarea{
        box-sizing: border-box;
        padding: 10px;
        height: 100%;
        width: 100%;
        border: none;
        outline: none;
    }


    .dialog-input-button{
        padding: 0px 10px;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        height: 40px;
    }
    .dialog-input-button button{
        background-color: #0099ff;
        border: none;
        border-radius: 999px;
        width: 60px;
        height: 30px;
        color: white;
    }
    .dialog-input-button button:hover{
        cursor: pointer;
        background-color: #42b0fa;
    }
    .dialog-input-button button:active{
        background-color: #007ccf;
    }

</style>