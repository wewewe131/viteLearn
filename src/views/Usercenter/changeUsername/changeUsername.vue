<template>
    <div class="changeMain">
        <el-input v-model="name" placeholder="输入新昵称" size="normal" clearable @change=""></el-input>
        <div class="buttons">

            <MyButton @click="change">确定</MyButton>
            <MyButton @click="cancle">取消</MyButton>
        </div>
    </div>
</template>
<script lang="ts" setup>
import MyButton from '@/components/MyButton.vue';
import { emit, listen } from '@tauri-apps/api/event'
import { reactive, toRefs } from 'vue';
import { appWindow } from '@tauri-apps/api/window';
import login from '@/api/login';

const state = reactive({
    name: ''
})

listen('changeUsernameClose', () => {
    console.log('changeUsernameClose:监听到关闭修改窗口事件');
    appWindow.close()
})

listen("closeAllWindow", () => {
    appWindow.close()
})
function change() {
    login.updateUserInfo({ uname: name.value }).then(res => {
        emit('UserInfoChangeSuccess')
        appWindow.close()
    }
    )
}
function cancle() {
    appWindow.close()
}

const { name } = toRefs(state)
</script>
<style lang="scss" scoped>
.changeMain {
    display: grid;
    gap: 16px;
    grid-template-rows: 1fr 1fr;

    .buttons {
        padding: 5px 10px;
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
}
</style>