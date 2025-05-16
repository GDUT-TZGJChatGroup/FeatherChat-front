<script setup>
defineProps({
    content: String
})
</script>

<template>
    <li class="dialog-line">
        <div class="dialog-content">
            <pre>{{ content }}</pre>
        </div>
    </li>
</template>

<style scoped>
.dialog-line {
    width: 100%;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.dialog-content {
    min-width: calc(1em + 10px);
    min-height: calc(1em + 20px);
    max-width: 60%;
    border-radius: 10px;
    padding: 6px;
    background-color: #A8B7FF;
}

.dialog-line.send {
    justify-content: flex-start;
}

.dialog-line.send .dialog-content {
    background-color: #AAADBA;
}
</style>