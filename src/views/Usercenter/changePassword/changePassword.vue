<template>
    <div id="main">
        <el-input v-model="oldPwd" placeholder="输入旧密码" size="large" clearable @change=""></el-input>
        <el-input v-model="newPwd" placeholder="输入新密码" size="large" clearable @change=""></el-input>
        <el-input v-model="newPwd2" placeholder="再次输入新密码" size="large" clearable @change=""></el-input>
        <div class="buttons">
            <MyButton @click="change">确定</MyButton>
            <MyButton @click="cancle" bgcolor="#FF0000">取消</MyButton>
        </div>
    </div>
</template>
<script lang="ts" setup>
import MyButton from '@/components/MyButton.vue';
import { emit, listen } from '@tauri-apps/api/event'
import { reactive, toRefs } from 'vue';
import { appWindow } from '@tauri-apps/api/window';
import login from '@/api/login';
import message from '@/utils/Messge';
import config from '@/config/config';

const state = reactive({
    oldPwd: '',
    newPwd: '',
    newPwd2: ''
})


listen('changePasswordClose', () => {
    console.log('changePasswordClose:监听到关闭修改窗口事件');
    appWindow.close()
})
listen("closeAllWindow", () => {
    appWindow.close()
})
function change() {
    if (newPwd.value !== newPwd2.value) {
        alert('两次输入的密码不一致')
        return
    }
    login.rePassword(oldPwd.value, newPwd.value).then(async res => {
        emit('UserInfoChangeSuccess')
        if (res.data.data === "修改成功") {
            let flag = await confirm('修改成功,是否重新登录?')
            if (flag)
                config.logout()
        } else {
            alert(res.data.msg)
        }
    })
}
function cancle() {
    appWindow.close()
}

const { oldPwd, newPwd, newPwd2 } = toRefs(state)


</script>
<style lang="scss" scoped>
#main {
    padding: 5px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .buttons {
        padding: 5px 10px;
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
}
</style>