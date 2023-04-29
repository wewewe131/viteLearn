<template>
    <div class="chatMain">
        <div class="chatBox">
            <div class="chatList">
                <div class="chatItem" v-for="i, index in chatList" :key="index">
                    <div class="left">
                        <img src="../../assets/image/下载.jpg" width="30" alt="">
                    </div>
                    <div class="right">
                        <div class="info">
                            <div class="name">{{ i.uName }}</div>
                            <div class="time">{{ i.time }}</div>
                        </div>
                        <div class="content">{{ i.uContent }}</div>
                    </div>
                </div>
            </div>
            <div class="inputBox">
                <div class="messageBox">
                    <textarea autofocus></textarea>
                </div>
                <div class="activeButton">
                    <MyButton>发送</MyButton>
                    <MyButton>取消</MyButton>
                </div>
            </div>
        </div>
        <div class="memberBox">
            <div class="title">群员列表：</div>
            <div class="memberList">
                <div class="memberItem" v-for="i, index in memberList" :key="index">
                    <div class="left">
                        <img src="../../assets/image/下载.jpg" width="30" alt="">
                        <div class="point" :style="{ backgroundColor: i.online ? '#cbff65' : '#999' }">
                            <!-- 在线状态显示 -->
                        </div>
                    </div>
                    <div class="center">
                        <div class="name">{{ i.uName }}</div>
                    </div>
                    <div class="right">
                        <el-icon :color="i.role == 'host' ? '#ff7800' : i.role == 'admin' ? '#75D557' : '#FFF'">
                            <UserFilled />
                        </el-icon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import MyButton from '@/components/MyButton.vue';
import type { List } from 'lodash';
import { reactive, toRefs } from 'vue';
const state = reactive({
    memberList: [
        {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        },
        {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: '123'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: 'admin'
        }, {
            uName: '123',
            uId: '123',
            uAvatar: '123',
            online: '123',
            role: 'host'
        },
    ],
    chatList: [
        {
            uName: '123',
            uContent: 'abc',
            uAvatar: '123',
            time: '2023-1-1 12:12:12',
        },
        {
            uName: '123',
            uContent: '33333333333333333333333333333333333333333333333331311231321213231231321111131223113312223213132123123131213312212332113232112332113231231321223113223131211232332321132131231212312313212331221313212313232211313322133123121322313122131232311233121233213123211322313123125631426534eqw56e411849afsd148afsd148fads148dsaf418dfas418dafs418dafs148adfs841asd48f1as89d4f1as89df41a8s9df41asd894f1asdf4a181a8sdf49fa1sd48d418fasa8sd41faf8s14dsdaf8411a8sdf4dsf41a8a1s8df4af41ds8afsd814',
            uAvatar: '123',
            time: '2023-1-1 12:12:12',
        },
        {
            uName: '123',
            uContent: '33333333333333333333333333333333333333333333333331311231321213231231321111131223113312223213132123123131213312212332113232112332113231231321223113223131211232332321132131231212312313212331221313212313232211313322133123121322313122131232311233121233213123211322313123125631426534eqw56e411849afsd148afsd148fads148dsaf418dfas418dafs418dafs148adfs841asd48f1as89d4f1as89df41a8s9df41asd894f1asdf4a181a8sdf49fa1sd48d418fasa8sd41faf8s14dsdaf8411a8sdf4dsf41a8a1s8df4af41ds8afsd814',
            uAvatar: '123',
            time: '2023-1-1 12:12:12',
        },
        {
            uName: '123',
            uContent: '33333333333333333333333333333333333333333333333331311231321213231231321111131223113312223213132123123131213312212332113232112332113231231321223113223131211232332321132131231212312313212331221313212313232211313322133123121322313122131232311233121233213123211322313123125631426534eqw56e411849afsd148afsd148fads148dsaf418dfas418dafs418dafs148adfs841asd48f1as89d4f1as89df41a8s9df41asd894f1asdf4a181a8sdf49fa1sd48d418fasa8sd41faf8s14dsdaf8411a8sdf4dsf41a8a1s8df4af41ds8afsd814',
            uAvatar: '123',
            time: '2023-1-1 12:12:12',
        },
        {
            uName: '123',
            uContent: '33333333333333333333333333333333333333333333333331311231321213231231321111131223113312223213132123123131213312212332113232112332113231231321223113223131211232332321132131231212312313212331221313212313232211313322133123121322313122131232311233121233213123211322313123125631426534eqw56e411849afsd148afsd148fads148dsaf418dfas418dafs418dafs148adfs841asd48f1as89d4f1as89df41a8s9df41asd894f1asdf4a181a8sdf49fa1sd48d418fasa8sd41faf8s14dsdaf8411a8sdf4dsf41a8a1s8df4af41ds8afsd814',
            uAvatar: '123',
            time: '2023-1-1 12:12:12',
        },
    ]
})
let { memberList, chatList } = toRefs(state);
</script>
<style lang="scss" scoped>
.chatMain {
    background-color: #fff;
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 3fr 1fr;

    .chatBox {
        overflow: hidden;

        .chatList {
            height: 70%;
            width: 100%;
            border-bottom: 1px solid #e5e5e5;
            overflow-y: scroll;

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
                            margin-bottom: 5px;
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
                        margin-right: 10px;
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