<template>
    <div class="userInfoMain">
        <div class="left">
            <div class="info">
                <div class="avatar" v-if="userInfo.userAvatar !== ''">
                    <img :src="config.filePath + 'avatar/' + userInfo.userAvatar" height="200" width="200"
                        style="border-radius: 50%;" alt="">
                </div>
                <div class="name">{{ userInfo.userName }}</div>
                <div class="id">用户ID：{{ userInfo.userId }}</div>
            </div>
            <div class="buttons">
                <MyButton radius="5px" size="1" bgcolor="#FF0000" @click="toFriendHandler">发消息</MyButton>
                <MyButton radius="5px" size="1" bgcolor="#FF0000" @click="deleteFriend">删除好友</MyButton>
            </div>
        </div>
        <div class="right">
            <div class="setGroup">
                <div class="label">
                    好友分组：
                </div>
                <div class="item">
                    <select class="select" v-model="userInfo.friendGroup">
                        <option v-for="item in groups" :value="item">{{ item }}</option>
                    </select>
                    <MyButton @click="changeFriendGroup" radius="5px" size="1" bgcolor="#FF0000">修改</MyButton>
                </div>
            </div>
            <div class="sex">
                <div class="label">
                    性别：
                </div>
                <div class="item">
                    {{ userInfo.userSex }}
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import friend from '@/api/friend';
import MyButton from '@/components/MyButton.vue';
import message from '@/utils/Messge';
import request from '@/utils/request';
import { emit, listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';
import { appWindow } from '@tauri-apps/api/window';
import { reactive, toRefs } from 'vue';
import config from '@/config/config';
import session from '@/api/session';
const state = reactive({
    userGroup: '',
    groups: [],
    userInfo: {
        userAvatar: "",
        userId: "",
        userName: "",
        userSex: "",
        signature: "",
        friendGroup: ""
    },
    loginUserId: ""

})

listen("userInfoViewClose", () => {
    appWindow.close()
})
listen("closeAllWindow", () => {
    appWindow.close()
})
const { groups, userInfo, loginUserId } = toRefs(state);
invoke("get_search_id_command").then((res: any) => {
    friend.getFriendInfo(res).then(res => {
        console.log(res.data.data);
        userInfo.value = {
            userAvatar: res.data.data.uavatar,
            userId: res.data.data.uid,
            userName: res.data.data.uname,
            userSex: res.data.data.usex ? '男' : '女',
            signature: res.data.data.signature,
            friendGroup: res.data.data.friendGroup
        }
    })
})
invoke("get_login_user_id_command").then((res: any) => {
    loginUserId.value = res
})
function toFriendHandler() {
    console.log('进入群聊');
    session.createSession({
        lastMessage: "",
        userId: userInfo.value.userId,
        receiveId: loginUserId.value,
        receiveName: userInfo.value.userName,
        sessionType: "friend"
    }).then(res => {
        if (res.data.code == 200) {
            console.log(res.data.data);
        }
    })
}
friend.getFriendGroups().then(res => {
    console.log(res.data.data);
    groups.value = res.data.data
})
function send() {
    emit('userInfoView_close')
    appWindow.close()
}
async function deleteFriend() {
    if (await confirm("是否删除好友")) {
        friend.deleteFriend(userInfo.value.userId).then((res: any) => {
            setTimeout(() => send(), 100)
        })
        // send()
    }

}
function changeFriendGroup() {
    friend.changeFriendGroup(userInfo.value.userId, userInfo.value.friendGroup).then((res: any) => {
        console.log(res.data);
        message(res.data.data, res.data.success ? "success" : "info")
    })
}
</script>
<style lang="scss" scoped>
.userInfoMain {
    display: flex;
    flex-direction: row;

    .left {
        flex: 1;

        .info {
            display: flex;
            flex-direction: column;
            align-items: center;

            .avatar {
                margin-top: 20px;
            }

            .name {
                margin-top: 20px;
                font-size: 20px;
            }

            .id {
                margin-top: 20px;
                font-size: 16px;
            }
        }

        .buttons {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            margin-top: 20px;
        }
    }

    .right {
        flex: 3;
        display: flex;
        flex-direction: column;
        gap: 20px;

        .setGroup {
            display: flex;
            flex-direction: row;
            align-items: center;

            .label {
                flex: 1;
                font-size: 16px;
            }

            .item {
                flex: 3;
                display: flex;
                justify-content: space-between;
                padding: 0px 10px;

                .select {
                    height: 30px;
                    font-size: 16px;
                    width: 80%;
                }
            }
        }

        .sex {
            display: flex;
        }
    }
}
</style>