<template>
    <div class="userMain">
        <div class="userInfo">
            <div class="userAvatar">
                <img height="100" style="border-radius: 50%;margin-right: 10px;" width="100"
                    :src="config.filePath + 'avatar/' + userInfo.userAvatar" alt="">
            </div>
            <div class="userNameAndId">
                <span>用户名：{{ userInfo.userName }}</span>
                <span>ID：{{ userInfo.userId }}</span>
                <span>签名： {{ userInfo.signature }}</span>
            </div>
        </div>
        <div class="item reavatar" @click="changeUserAvatar">
            <div> 修改头像</div>
            <el-icon color="#999">
                <ArrowRightBold />
            </el-icon>
        </div>
        <div class="item reName" @click="changeUserNameHandler">
            <div> 修改用户名</div>
            <el-icon color="#999">
                <ArrowRightBold />
            </el-icon>
        </div>
        <div class="item resignature" @click="changeUserSignature">
            <div> 修改签名</div>
            <el-icon color="#999">
                <ArrowRightBold />
            </el-icon>
        </div>
        <div class="item rePassword" @click="changeUserPwd">
            <div> 修改密码</div>
            <el-icon color="#999">
                <ArrowRightBold />
            </el-icon>
        </div>
    </div>
</template>
<script lang="ts" setup>
import newWindow from '@/views/windowsManager/windosManager';
import { appWindow } from '@tauri-apps/api/window';
import { emit, listen } from '@tauri-apps/api/event'
import { reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { UserInfo } from '@/stores/Store';
import { storeToRefs } from 'pinia';
import login from '@/api/login';
import config from '@/config/config';
import { invoke } from '@tauri-apps/api';

let store = UserInfo()
let { userInfo } = storeToRefs(store)
const state = reactive({
    user: {
        name: '用户名',
        avatar: '',
        signature: '签名'
    }
})

let router = useRouter()



let changeUserNameHandler = async () => {
    newWindow.newWindow('changeUsername', {
        url: '/changeUsername',
        height: 100,
        width: 300,
        center: true,
        title: '修改用户名',
        resizable: false,
        fullscreen: false,
    })
}
let changeUserSignature = async () => {
    newWindow.newWindow('changeSignature', {
        url: '/changeSignature',
        height: 100,
        width: 300,
        center: true,
        title: '修改签名',
        resizable: false,
        fullscreen: false,
    })
}
let changeUserPwd = async () => {
    newWindow.newWindow('changePassword', {
        url: '/changePassword',
        height: 250,
        width: 300,
        center: true,
        title: '修改密码',
        resizable: false,
        fullscreen: false,
    })
}
let changeUserAvatar = async () => {
    newWindow.newWindow('changeAvatar', {
        url: '/changeAvatar',
        height: 350,
        width: 300,
        center: true,
        title: '修改头像',
        resizable: false,
        fullscreen: false,
    })
}
function getUserInfo() {
    login.getUserInfo().then(res => {
        console.log(res);
        store.setUserInfo({
            userAvatar: res.data.data.uavatar,
            userId: res.data.data.uid,
            userName: res.data.data.uname,
            userSex: res.data.data.usex ? '男' : '女',
            signature: res.data.data.signature
        })
    })
}
listen('UserInfoChangeSuccess', () => {
    getUserInfo()
    console.log('UserInfoChangeSuccess');
})
const { user } = toRefs(state)
</script>
<style lang="scss" scoped>
.userMain {
    height: 100%;
    width: 100%;
    background-color: #fff;

    .userInfo {
        padding: 10px;
        display: grid;
        grid-template-columns: 1fr 10fr;
        grid-auto-flow: row;

        .userNameAndId {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    }

    .item {
        padding: 5px 10px;
        border-bottom: 1px solid #e1e1e1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;

        &:hover {
            background-color: #f5f5f5;
        }

        &.reavatar {
            border-top: 1px solid #e1e1e1;
            margin-top: 10px;
        }

    }
}
</style>