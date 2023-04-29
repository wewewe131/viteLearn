<template>
    <div class="groupMain">
        <div class="navButton">
            <div class="navButtonRight">
                <MyButton bgcolor="#0084ff" size="1" @click="joinGroupHandler">添加群聊</MyButton>
                <MyButton bgcolor="#0084ff" size="1" @click="createGroup">创建群聊</MyButton>
            </div>
        </div>

        <div class="groupList">
            <div v-for="(i, index) in groupList" :key="index" class="groupGroup">
                <div class="groupName" @click="i.show = !i.show">
                    <!-- <div class="groupName" @click="i.show = !i.show"> -->
                    <div class="groupleft">
                        <div class="arrowBox">
                            <div :class="i.show ? 'showList' : 'hideList'" class="arrow"></div>
                        </div> {{ i.groupGroupingName }}
                    </div>
                </div>

                <div class="groupGroupList" :style="{ display: i.show ? 'initial' : 'none' }">
                    <div v-for="(j, index) in i.groupList" :key="index" @click="openGroupInfoHandler(j.groupId)"
                        class="groupGroupListItem">
                        <img :src="config.filePath + 'avatar/' + j.groupAvatar" height="50" width="50" alt="">
                        <div class="friendInfo">
                            <div>{{ j.groupName }}</div>
                            <div>{{ j.groupDescription }}</div>
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
import newWindow from '@/views/windowsManager/windosManager';
import { listen } from '@tauri-apps/api/event';
import { onMounted, reactive, toRefs, ref } from 'vue';

const state = reactive({
    groupList: [
        {
            groupGroupingName: '',
            groupList: [
                {
                    "groupId": "100004",
                    "groupName": " ????",
                    "groupDescription": "123456",
                    "status": 1,
                    "isDel": 0,
                    groupAvatar:'',
                    "createTime": "2023-04-10T23:38:30",
                    "updateTime": "2023-04-10T23:38:30"
                }
            ],
            show: false,
        }
    ],
    groupManager: false,
})

onMounted(() => {
    initList()
})
function initList() {
    window.oncontextmenu = function (e) {
        return false;
    };
    group.getGroupGrouping().then((res) => {
        let list: any[] = [];

        res.data.data.forEach((i: any) => {
            list.push({
                ...i,
                show: false,
            })
        });

        groupList.value = list;
        console.log(res);
    });
}
async function openGroupInfoHandler(groupId: string) {
    newWindow.newWindow('groupInfoView', {
        url: '/groupInfo/' + groupId,
        width: 700,
        height: 500,
        title: '群聊信息',
        resizable: false,
        fullscreen: false,
        center: true,
    })

}
function joinGroupHandler() {
    newWindow.newWindow('joinGroup', {
        url: '/joinGroup',
        width: 600,
        height: 300,
        title: '加入群聊',
        resizable: false,
        fullscreen: false,
    })
}

function createGroup() {
    newWindow.newWindow('createGroup', {
        url: '/createGroup',
        width: 600,
        height: 300,
        title: '创建群聊',
        resizable: false,
        fullscreen: false,
    })
}
listen('reloadGroupList', (e) => {
    initList()
})
const { groupList, groupManager } = toRefs(state)
</script>
<style lang="scss" scoped>
.groupMain {
    height: 100%;
    width: 100%;
    background-color: #fff;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .menu {
        position: absolute;
        display: none;
        width: 100px;
        height: 100px;
        background-color: #fff;
        border: 1px solid #000;
    }

    .navButton {
        flex: 1;
        display: flex;
        flex-direction: row-reverse;

        .navButtonRight {
            display: flex;

            :deep(.el-button) {
                border-radius: 0px;
            }
        }
    }

    .groupList {
        margin-top: 10px;
        flex: 99;
        overflow-y: auto;

        .groupGroup {
            min-height: 30px;
            display: flex;
            flex-direction: column;
            font-size: 14px;

            .groupName {
                height: 30px;
                cursor: pointer;
                user-select: none;
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #f1f1f1;

                .groupleft {
                    display: flex;
                    align-items: center;
                    gap: 10px;

                    .arrowBox {
                        .arrow {
                            border: 4px solid transparent;
                        }

                        .showList {
                            border-top-color: #000;
                        }

                        .hideList {
                            border-left-color: #000;
                        }
                    }
                }

                .groupright {
                    .delGroupButton {
                        display: flex;
                    }

                }
            }

            .groupGroupList {
                padding-left: 10px;
                display: flex;
                flex-direction: column;
                gap: 10px;

                .groupGroupListItem {
                    padding: 5px 0;
                    user-select: none;
                    cursor: pointer;
                    display: flex;
                    border-bottom: 1px solid #e5e5e5;

                    .friendInfo {
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        padding-left: 10px;
                    }
                }
            }

        }
    }
}
</style>