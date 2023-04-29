<template>
    <div class="infoMain" v-if="userId">
        <div class="left">
            <div class="info">
                <div class="avatar">
                    <input @change="changeAvatar" type="file" accept="image/*" style="display: none;" ref="avatar">
                    <img @click="userRole != '3' ? showFileWindow() : ''"
                        :src="config.filePath + 'avatar/' + groupInfo.groupAvatar" height="200" width="200"
                        style="border-radius: 50%;cursor: pointer;" alt="">
                </div>
                <div class="name" :style="{ cursor: userRole != '3' ? 'pointer' : 'initial' }"
                    @click="userRole != '3' ? reGroupNameMode = true : ''">{{ groupInfo.groupName }}</div>
                <div class="name" v-if="reGroupNameMode">
                    <input @keydown.esc="reGroupNameMode = false" placeholder="输入后按回车提交修改" type="text"
                        v-model="newGroupName" @keydown.enter="reGroupNameHandler">
                </div>
                <div class="id">群聊ID：{{ groupInfo.groupId }}</div>
            </div>
            <div class="button">
                <MyButton @click="toGroupHandler">进入群聊</MyButton>
                <MyButton @click="exitGroupHandler">退出群聊</MyButton>
                <MyButton @click="deleteGroupHandler" bgcolor="#FF0000">解散群聊</MyButton>
            </div>
        </div>
        <div class="right">
            <div class="groupUserBox">
                <div class="groupUser" v-for="i, index in groupUserInfoVos" :key="index"
                    @click="toUserInfo(i.chatUser.uid)">
                    <img style="margin-right: 10px;" v-if="i.chatUser.uavatar"
                        :src="config.filePath + 'avatar/' + i.chatUser.uavatar" height="50" width="50" alt="">
                    <div class="name">{{ i.chatUser.uname }}</div>
                    <div class="info">
                        <el-tag style="width: 50px;"
                            :type="i.auth == '1' ? 'warning' : i.auth == '2' ? 'success' : 'primary'" size="large">{{
                                i.auth == '1' ? "群主" : i.auth == '2' ? "管理员" : "群员" }}</el-tag>

                        <div class="manager" v-if="i.auth != '1'">
                            <MyButton v-if="userRole == '1' && i.auth != '2'"
                                @click.stop="removeUserInGroup(i.chatUser.uid)" bgcolor="#FF0000">
                                移除</MyButton>
                            <MyButton v-if="userRole == '1' && i.auth == '3'" @click.stop="setAdminHandler(i.chatUser.uid)"
                                bgcolor="#FF0000">
                                设为管理
                            </MyButton>
                            <MyButton v-else-if="userRole == '1' && i.auth == '2'"
                                @click.stop="cancleAdminHandler(i.chatUser.uid)" bgcolor="#FF0000">取消管理</MyButton>
                            <MyButton v-if="userRole == '1' && i.auth == '2'" @click.stop="setHostHandler(i.chatUser.uid)"
                                bgcolor="#FF0000">转让群主</MyButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import group from '@/api/group';
import MyButton from '@/components/MyButton.vue';
import config from '@/config/config';
import router from '@/router';
import message from '@/utils/Messge';
import { invoke } from '@tauri-apps/api';
import { emit, listen } from '@tauri-apps/api/event';
import { appWindow } from '@tauri-apps/api/window';
import { computed } from '@vue/reactivity';
import { onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import newWindow from '@/views/windowsManager/windosManager';
import { ElLoading } from 'element-plus';
import session from '@/api/session';

let state = reactive({
    "groupInfo": {
        "groupId": "",
        "groupName": "",
        "groupDescription": "",
        "status": 0,
        "isDel": 0,
        "createTime": "",
        "updateTime": "",
        groupAvatar: ''
    },
    "groupUserInfoVos": [
        {
            "chatUser": {
                "uid": "",
                "uname": "",
                "uavatar": "",
                "usex": "",
                "signature": "",
                "createTime": "",
                "updateTime": "",
                "status": 0,
                "isDel": 0
            },
            "auth": ""
        }
    ],
    admins: [],
    userId: '',
    newGroupName: '',
    reGroupNameMode: false

})

let { newGroupName, reGroupNameMode, userId, groupInfo, groupUserInfoVos, admins } = toRefs(state)

let userRole = computed(() => groupUserInfoVos.value.filter(i => i.chatUser.uid == userId.value)[0]?.auth)

invoke('get_login_user_id_command').then((res: any) => {
    console.log(res);
    userId.value = res
})

onMounted(async () => {

    initInfo()

})
let avatar = ref(null)
function changeAvatar() {
    const fileloading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    let el: HTMLInputElement = avatar.value as any
    let read = new FileReader()
    if (el.files == null)
        return
    read.readAsDataURL(el.files[0])
    read.onload = (e: any) => {
        group.updateGroupAvatar(groupInfo.value.groupId, e.target.result).then((res: { data: { data: unknown; }; }) => {
            fileloading.close()

            router.go(0)
        })
    }
}

function showFileWindow() {
    let el: HTMLInputElement = avatar.value as any
    el.click()
}



function initInfo() {
    let route = useRoute()
    let id = route.params.groupId as string
    group.getGroupInfo(id).then(res => {
        admins.value = res.data.data.groupUserInfoVos.filter((i: any) => i.auth == '1' || i.auth == '2')
        groupInfo.value = res.data.data.group
        groupUserInfoVos.value = res.data.data.groupUserInfoVos
    })
}

function reGroupNameHandler() {
    if (newGroupName.value == '')
        return message('群名不能为空', 'error')
    groupInfo.value.groupName = newGroupName.value
    group.updateGroupInfo(groupInfo.value).then(res => {
        if (res.data.code == 200) {
            groupInfo.value.groupName = newGroupName.value
            reGroupNameMode.value = false
            newGroupName.value = ''
        }
    })
}

function toGroupHandler() {
    console.log('进入群聊');
    session.createSession({
        lastMessage: "",
        userId: userId.value,
        receiveId: groupInfo.value.groupId,
        receiveName: groupInfo.value.groupName,
        sessionType: "group"
    }).then(res => {
        if (res.data.code == 200) {
            console.log(res.data.data);
        }
    })
}

async function exitGroupHandler() {
    if (userRole.value == '1')
        return message('群主无法退出群聊', 'error')
    let flag = await confirm('确定退出群聊吗？')
    if (flag) {
        group.exitGroup(groupInfo.value.groupId).then(res => {
            if (res.data.code == 200) {
                emit("reloadGroupList")
                appWindow.close()
            }
        })
    }
    console.log('退出群聊');
}

function removeUserInGroup(uid: string) {
    group.removeUserInGroup(groupInfo.value.groupId, uid).then(res => {
        if (res.data.code == 200) {
            groupUserInfoVos.value = groupUserInfoVos.value.filter((i: any) => i.chatUser.uid != uid)
        }
    })
}

function setAdminHandler(uid: string) {
    group.updateGroupUserRelation({ authId: "2", uid, groupid: groupInfo.value.groupId }).then(res => {
        emit("reloadGroupList").then(() => {
            router.go(0)
        })
    })
}

function cancleAdminHandler(uid: string) {
    group.updateGroupUserRelation({ authId: "3", uid, groupid: groupInfo.value.groupId }).then(res => {
        emit("reloadGroupList").then(() => {
            router.go(0)
        })
    })
}
function setHostHandler(uid: string) {
    group.updateGroupUserRelation({ authId: "1", uid, groupid: groupInfo.value.groupId }).then(res => {
        emit("reloadGroupList").then(() => {
            router.go(0)
        })
    })
    group.updateGroupUserRelation({ authId: "2", uid: userId.value, groupid: groupInfo.value.groupId }).then(res => {
        emit("reloadGroupList").then(() => {
            router.go(0)
        })

    })
}

async function deleteGroupHandler() {
    await confirm('确定解散群聊吗？') &&
        group.deleteGroup(groupInfo.value.groupId).then(res => {
            if (res.data.code == 200) {
                emit("reloadGroupList")
                appWindow.close()
            }
        })
}

function toUserInfo(uid: string) {
    alert("用户ID：" + uid)
}

listen("groupInfoViewClose", () => {
    appWindow.close()
})
listen("closeAllWindow", () => {
    appWindow.close()
})
</script>
<style lang="scss" scoped>
.infoMain {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 3fr;
    overflow: hidden;

    .left {
        padding: 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: #c4c4c4;
        box-sizing: border-box;

        .info {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

        }

        .button {
            display: grid;
            grid-template-rows: 50px 50px 50px;
            gap: 20px;

            * {
                margin-left: 0px;
            }
        }
    }

    .right {
        overflow: auto;
        height: 100%;
        padding: 10px;
        flex: 2.5;

        .groupUserBox {
            height: 100%;
            overflow-y: scroll;

            .groupUser {
                margin: 10px;
                display: flex;
                align-items: center;

                .name {
                    flex: 1;
                }

                .info {
                    flex: 3;
                    display: flex;
                    width: 100%;
                    justify-content: space-between;

                    .manager {
                        flex: 1;
                        display: flex;
                        gap: 10px;
                        align-items: center;
                        justify-content: center;
                    }
                }
            }
        }
    }
}
</style>