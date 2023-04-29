<template>
    <div class="main">
        <div class="left">
            <LeftMenuVue>测试</LeftMenuVue>
            <div class="userinfo" v-if="userInfo.userAvatar">
                <img height="50" width="50" :src="config.filePath + 'avatar/' + userInfo.userAvatar" alt="">
                <div class="userinforight">
                    <div class="name">{{ userInfo.userName }}</div>
                    <div class="id">ID: {{ userInfo.userId }}</div>
                </div>
            </div>
        </div>
        <div class="right">
            <RouterView v-slot="{ Component }">
                <component :is="Component"></component>
            </RouterView>
        </div>

    </div>
</template>
    
<script lang='ts' setup>
// When using the Tauri API npm package:
// import { invoke } from '@tauri-apps/api/tauri'
// import { emit, listen } from '@tauri-apps/api/event';

import LeftMenuVue from '@/components/LeftMenu.vue';
import { getCurrentInstance, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { UserInfo, ApplyInfo } from "@/stores/Store.js"
import { storeToRefs } from 'pinia';
import apply from "@/api/apply"
import testSocket from '@/utils/resocket'
import login from '@/api/login';
import group from '@/api/group';
import message from '@/utils/Messge';
import config from '@/config/config';
import { emit, listen } from '@tauri-apps/api/event';
import { appWindow } from '@tauri-apps/api/window';
let userInfoStore = UserInfo()
let applyListStore = ApplyInfo()
let { applyList } = storeToRefs(applyListStore)
let { userInfo } = storeToRefs(userInfoStore)

let gParam = getCurrentInstance()?.appContext.config.globalProperties
// console.log(userInfoStore.getUserInfo);

apply.getApplyInfo().then((res: any) => {
    // console.log(res.data.data);

    applyList.value = res.data.data
})

getUserInfo().then(() => {
    testSocket.socket().then(res => {
        res.onopen = () => {
            // console.log("连接成功");
            res.send(JSON.stringify({ "msg": "我是客户端", "mode": "test" }));
        }

        res.onmessage = (e) => {
            // console.log("收到消息", e.data);
            let res = JSON.parse(e.data)
            // console.log(res);
            if (res.type == "group" || res.type == "friend") {
                message(res.type == "group" ? "收到一条入群申请" : "收到一条好友申请", "success")
                applyListStore.appendApplyList({
                    type: res.type,
                    id: res.id,
                    mark: res.mark,
                    applyId: res.applyId,
                    uid: res.uid,
                    userName: res.userName
                })
            }
        }

        res.onclose = () => {
            // console.log("连接关闭");
        }
        res.onerror = () => {
            // console.log("连接错误");
        }
    })
}
)

async function getUserInfo() {
    await login.getUserInfo().then(res => {
        // console.log(res);
        userInfoStore.setUserInfo({
            userAvatar: res.data.data.uavatar,
            userId: res.data.data.uid,
            userName: res.data.data.uname,
            userSex: res.data.data.usex ? '男' : '女',
            signature: res.data.data.signature
        })
    })
}

onMounted(async () => {
    // console.log("调用了Layout的Mounted");
    emit("mainClose")
})

listen("layoutClose", () => {
    appWindow.close()
})

listen("closeAllWindow", () => {
    appWindow.close()
})
</script>
    
<style lang='scss' scoped>
.main {
    display: flex;
    height: 100%;
    width: 100%;

    .left {
        width: 150px;
        height: 100%;
        // border: 1px solid #e5e5e5;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: #f1f1f1;

        .userinfo {
            box-shadow: -6px -3px 5px 5px #e5e5e5;
            display: flex;
            background-color: #fff;
            box-sizing: border-box;

            .userinforight {
                display: flex;
                flex-direction: column;
                justify-content: center;
                margin-left: 10px;

                .name {
                    font-size: 14px;
                    color: #000;
                }

                .id {
                    font-size: 12px;
                    color: #999;
                }
            }
        }
    }

    .right {
        margin: 10px;
        flex: 1;
        background-color: #dfdfdfa1;

        .nav {
            width: 100%;
            text-align: center;

            .title {
                display: inline-block;
            }
        }
    }
}
</style>
    