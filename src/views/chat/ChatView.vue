<template>
    <div class="chatMain" v-if="sessionInfo.sessionType != ''">
        <div class="chatBox">
            <div class="chatList">
                <div class="chatItem" :style="{ 'flex-direction': i.sendUserId == userInfo.userId ? 'row-reverse' : 'row' }"
                    v-for="(i, index) in chatList" :key="index">
                    <div class="left">
                        <img style="border-radius: 50%;" :src="config.filePath + 'avatar/' + i.sendUserAvatar" width="30" alt="">
                    </div>
                    <div class="right" :style="{ 'flex-direction': i.sendUserId == userInfo.userId ? 'row-reverse' : 'row' }">
                        <div class="info" :style="{ 'flex-direction': i.sendUserId == userInfo.userId ? 'row-reverse' : 'row' }">
                            <div class="name">{{ i.sendUser }}</div>
                            <div class="time">{{ i.createTime }}</div>
                        </div>
                        <div class="content">{{ i.message }}</div>
                    </div>
                </div>
            </div>
            <div class="inputBox">
                <div class="messageBox">
                    <textarea v-model="messageText" autofocus></textarea>
                </div>
                <div class="activeButton">
                    <MyButton @click="sendMessage">发送</MyButton>
                    <MyButton @click="cancleSend">退出</MyButton>
                </div>
            </div>
        </div>
        <div class="memberBox" v-if="sessionInfo.sessionType == 'group'">
            <div class="title">群员列表：</div>
            <div class="memberList">
                <div class="memberItem" v-for="i, index in memberList" :key="index">
                    <div class="left">
                        <img :src="config.filePath + 'avatar/' + i.chatUser.uavatar" width="30" alt="">
                        <div class="point" :style="{ backgroundColor: i.chatUser.isOnline ? '#cbff65' : '#999' }">
                            <!-- 在线状态显示 -->
                        </div>
                    </div>
                    <div class="center">

                        <div class="name">{{ i.chatUser.uname }}</div>
                    </div>
                    <div class="right">
                        <el-icon :color="i.auth == '1' ? '#ff7800' : i.auth == '2' ? '#75D557' : '#FFF'">
                            <UserFilled />
                        </el-icon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import message from '@/api/message';
import session from '@/api/session';
import MyButton from '@/components/MyButton.vue';
import { emit, listen } from '@tauri-apps/api/event';
import { onMounted, reactive, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { UserInfo } from '@/stores/Store';
import { storeToRefs } from 'pinia';
import group from '@/api/group';
import config from '@/config/config';
import router from '@/router';


let userStore = UserInfo();
let { userInfo } = storeToRefs(userStore);
const state = reactive({
    memberList: [
    ] as Member[],
    chatList: [
    ] as Message[],
    sessionInfo: { id: '', sessionType: '', receiveId: '' },
    messageText: ''
})
let { memberList, chatList, messageText } = toRefs(state);
let route = useRoute()
let { sessionInfo } = toRefs(state)
onMounted(() => {
    let id = route.params.sessionId as string
    session.getSessionInfo(id).then(res => {
        console.log(res)
        sessionInfo.value = res.data.data
    }).then(() => {
        message.getMessageList(sessionInfo.value.id).then(res => {
            console.log(res)
            chatList.value = res.data.data
            setTimeout(() => {
                setScroll()
            }, 0);
        })
        group.getGroupInfo(sessionInfo.value.receiveId).then(res => {
            console.log(res)
            memberList.value = res.data.data.groupUserInfoVos
        })
    })

})
function cancleSend() {
    sessionInfo.value = { id: '', sessionType: '', receiveId: '' }
    chatList.value = []
    memberList.value = []
    messageText.value = ''
    router.push("/layout/sessionList")
}
interface Message {
    sendUserId: string,
    sendUserAvatar: string,
    message: string,
    sendUser: string,
    sessionId: string,
    createTime?: string
}
interface Session {
    data: Message,
    sessionType: string
}
interface Member {
    auth: string,
    chatUser: ChatUser,
}
interface ChatUser {
    uid: string,
    uname: string,
    uavatar: string,
    usex: string,
    signature: string,
    createTime: string,
    updateTime: string,
    isOnline: number
    isDel: 0
}
function setScroll() {
    let chatList = document.querySelector('.chatList') as HTMLElement
    chatList.scrollTop = chatList.scrollHeight
}
function sendMessage() {
    console.log(sessionInfo.value);
    let msg: Message = {
        sendUser: userInfo.value.userName,
        sendUserId: userInfo.value.userId,
        sendUserAvatar: userInfo.value.userAvatar,
        message: messageText.value,
        sessionId: sessionInfo.value.id
    };
    messageText.value = ''
    emit('send_socket_message', msg)
}
listen("new_message", payload => {
    console.log(payload.payload)
    let res = payload.payload as Session
    let message: Message = res.data
    if (message.sessionId == sessionInfo.value.id) {
        chatList.value.push(message)
        setTimeout(() => {
            setScroll()
        }, 0);
    }
})
</script>
<style lang="scss" scoped>
.chatMain {
    background-color: #fff;
    height: 100%;
    width: 100%;
    // display: grid;
    // grid-template-columns: 3fr 1fr;
    display: flex;

    .chatBox {
        flex: 3;
        width: 100%;
        overflow: hidden;

        .chatList {
            height: 70%;
            width: 100%;
            border-bottom: 1px solid #e5e5e5;
            overflow-y: scroll;
            padding-right: 10px;
            .chatItem {
                width: 100%;
                display: flex;
                padding: 10px 0;

                .left {
                    display: flex;
                    align-items: start;
                }

                .right {
                    width: 100%;
                    .info {
                        width: 100%;
                        display: flex;
                        justify-content: space-between;

                        .name {
                            font-size: 14px;
                            color: #333;
                            margin: 5px;
                        }

                        .time {
                            font-size: 12px;
                            color: #999;
                        }

                    }

                    .content {
                        white-space: normal;
                        word-break: break-all;
                        overflow: hidden;
                        background-color: #f1f1f1;
                        border-radius: 5px;
                        padding: 10px;
                    }
                }
            }
        }

        .inputBox {
            height: 120px;

            .messageBox {
                width: 100%;
                height: 120px;

                textarea {
                    width: 100%;
                    height: 110px;
                    resize: none;

                    outline: none;
                }
            }

            .activeButton {
                display: flex;
                justify-content: right;
            }
        }
    }

    .memberBox {
        border-left: 1px solid #e5e5e5;
        height: 100%;
        overflow: hidden;
        flex: 1;

        .memberList {
            overflow-y: scroll;
            height: 95%;
            padding: 10px;

            .memberItem {
                user-select: none;
                display: grid;
                grid-template-columns: 1fr 3fr 1fr;
                background-color: #fff;
                border-bottom: 1px solid #e5e5e5;
                padding: 5px;

                >div {
                    display: flex;
                    align-items: center;
                }

                .left {
                    position: relative;
                    width: 30px;
                    height: 30px;

                    >img {
                        border-radius: 50%;
                        overflow: hidden;
                    }

                    .point {
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        height: 10px;
                        width: 10px;
                        border-radius: 50%;
                    }
                }

                .center {}

                .right {}
            }
        }
    }
}
</style>