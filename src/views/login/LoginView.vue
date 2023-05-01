<template>
    <div class="main">
        <el-form v-if="!registUserflag" :model="form" :rules="rules" label-width="auto" :inline="false" size="small">
            <el-form-item label="账号：" prop="userId">
                <el-input v-model="form.userId"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
                <el-input type="text" v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item class="buttons">
                <MyButton size="1.5" @click="onSubmit">登陆</MyButton>
                <MyButton size="1.5" @click="registUserflag = true">注册</MyButton>
            </el-form-item>
        </el-form>
        <el-form v-if="registUserflag" :model="form" :rules="rules" label-width="auto" :inline="false" size="small">
            <el-form-item label="用户名：" prop="userName">
                <el-input v-model="form.userName"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
                <el-input type="text" v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item label="重复密码：" prop="rePassword">
                <el-input type="text" v-model="form.rePassword"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="form.sex" class="ml-4">
                    <el-radio label="1">男</el-radio>
                    <el-radio label="2">女</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item class="buttons">
                <MyButton size="1.5" @click="registHandler">注册</MyButton>
                <MyButton size="1.5" @click="registUserflag = false">返回登陆</MyButton>
            </el-form-item>
        </el-form>
    </div>
</template>
<script lang="ts" setup>

import { reactive, toRefs, watch, getCurrentInstance } from 'vue';
import login from "@/api/login";
import MyButton from '@/components/MyButton.vue';
import newWindow from "@/views/windowsManager/windosManager"
import { appWindow } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api/tauri';
import Message from "@/utils/Messge";
import { UserInfo } from '@/stores/Store';
import { storeToRefs } from 'pinia';
import { emit, listen } from '@tauri-apps/api/event';

const state = reactive({
    form: {
        userId: '',
        userName: '',
        password: '',
        rePassword: '',
        sex: ''
    },
    rules: {
        userId: [
            { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        rePassword: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }

        ],
        sex: [
            { required: true, message: '请选择性别', trigger: 'blur' },
        ]

    },
    registUserflag: false
})

let { form, rules, registUserflag } = toRefs(state)
let store = UserInfo()
//限制只能输入数字
// watch(() => form.value.password, (newVal) => {
//     form.value.password = newVal ? parseInt(newVal.toString()) : ''
// })
let { userInfo } = storeToRefs(store)

// listen("layoutSetup", () => {
//     console.log("info", store.userInfo);
//     emit("userInfoState", form.value.userId).then(() => {
//         console.log("发送成功");
//         appWindow.close()
//     })
// })

// async function getUserInfo() {
//     await login.getUserInfo().then(res => {
//         console.log(res);
//         store.userInfo = {
//             userAvatar: res.data.data.uavatar,
//             userId: res.data.data.uid,
//             userName: res.data.data.uname,
//             userSex: res.data.data.usex ? '男' : '女',
//             signature: res.data.data.signature
//         }
//     })
// }

const onSubmit = async () => {

    if (!form.value.userId || !form.value.password)
        return Message('账号或密码不能为空', "info")

    let flag = await login.login(form.value.userId, form.value.password).then(async res => {
        console.log(res);

        localStorage.setItem(`${form.value.userId}token`, res.data.data)
        // await getUserInfo()
        return { value: res.data.code == 200, msg: res.data.msg }
    })

    console.log(flag);

    if (!flag.value)
        return Message(flag.msg, "warning")

    newWindow.newWindow("layout", {
        url: "/layout/sessionList",
        center: true,
        resizable: false,
        fullscreen: false,
        title: 'layout',
        height: 500,
        width: 800,
    })
    await invoke("set_login_user_id_command", { userId: form.value.userId }).then(() => {
        console.log("发送成功");
        // appWindow.close()
    })

}

const registHandler = (e: any) => {
    //非空判断
    if (!form.value.userName || !form.value.password || !form.value.rePassword)
        return Message('账号或密码不能为空', "info")
    //用户名判断
    if (form.value.userName.length < 2 || form.value.userName.length > 12)
        return Message('用户名长度为2-12位', "warning")
    //性别判断
    if (form.value.sex == '')
        return Message('请选择性别', "warning")
    //密码判断
    if (form.value.password != form.value.rePassword)
        return Message('两次密码不一致', "warning")
    if (form.value.password.length < 6 || form.value.password.length > 12)
        return Message('密码长度为6-12位', "warning")

    login.regist(form.value.userName, form.value.password, form.value.sex).then(res => {
        console.log(res);
        if (res.data.code == 200) {
            Message('注册成功', "success")
            Message('您的账号为:' + res.data.data.uid, "success")
            form.value.userId = res.data.data.uid
            registUserflag.value = false
        }
        else {
            Message(res.data.msg, "warning")
        }
    })
}
emit("layoutClose")
listen("mainClose", () => {
    appWindow.close()
})


</script>

<style lang="scss" scoped>
.main {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

:deep(.buttons) {
    justify-content: center;

    .el-form-item__content {
        justify-content: center;
    }
}

:deep(.buttons) .el-button {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}
</style>