<template>
  <div ref="friendMain" class="friendMain">
    <div ref="menu" class="menu">
      菜单
    </div>
    <div class="navButton">
      <div class="navButtonRight">
        <div v-if="groupManager" class="addGroup">
          <input type="text" v-model="newGroupName">
          <MyButton bgcolor="#0084ff" size="1" @click="addNewGroup">添加分组</MyButton>
        </div>
        <MyButton bgcolor="#0084ff" size="1" @click="addFriend">添加好友</MyButton>
        <MyButton bgcolor="#0084ff" size="1"
          @click="groupManager = !groupManager, friendList.filter(v => v.isShow = false)">分组管理</MyButton>
      </div>
    </div>

    <div class="friendList">
      <div v-for="(i, index) in friendList" :key="index" class="friendGroup">
        <!-- <div class="groupName" @click="i.isShow = !i.isShow" @click.right.native='menutest($event, i.groupName)'> -->
        <div class="groupName" @click.stop="!groupManager ? i.isShow = !i.isShow : ''">
          <!-- <div class="groupName" @click="i.show = !i.show"> -->
          <div class="groupleft">
            <div class="arrowBox">
              <div :class="i.isShow ? 'showList' : 'hideList'" class="arrow"></div>
            </div> {{ i.groupName }}
          </div>
          <div class="groupright">
            <div class="delGroupButton">
              <MyButton v-if="groupManager && i.groupName != '我的好友'" bgcolor="#ff5b5b" size="1"
                @click.stop="deleteGroup(i.groupName)">
                删除分组
              </MyButton>
              <MyButton v-if="groupManager && i.groupName != '我的好友'" bgcolor="#ef9709" size="1"
                @click.stop="showRenameHandler(i)">
                重命名
              </MyButton>
              <div class="renameBlock" v-if="i.showRename">
                <div class="renameTitle">重命名</div>
                <input type="text" v-model="reGroupName">
                <div class="buttons">
                  <MyButton bgcolor="#0084ff" size="1" @click="reGroupNameHandler(i)">确定</MyButton>
                  <MyButton bgcolor="#ff5b5b" size="1" @click="showRenameHandler">取消</MyButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="friendGroupList" :style="{ display: i.isShow ? 'initial' : 'none' }">
          <div v-for="(j, index) in i.friendList" :key="index" class="friendGroupListItem"
            @click="openUserInfoHandler(j)">
            <img :src="config.filePath + 'avatar/' + j.uavatar" height="50" width="50" alt="">
            <div class="friendInfo">
              <div>{{ j.uname }}</div>
              <div>{{ j.signature }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import friend from '@/api/friend';
import MyButton from '@/components/MyButton.vue';
import config from '@/config/config';
import router from '@/router';
import newWindow from '@/views/windowsManager/windosManager';


import { invoke } from '@tauri-apps/api/tauri';
import { onMounted, reactive, toRefs, ref, onUnmounted } from 'vue';
import { useMounted } from '@vueuse/core';
import { listen } from '@tauri-apps/api/event';
import { get } from '@/utils/request';
const state = reactive({
  friendList: [{
    "groupName": "",
    "friendList": [
      {
        "uid": "",
        "uname": "",
        "uavatar": "",
        "usex": "",
        "signature": "",
        "createTime": "",
        "updateTime": "",
        "status": 1,
        "isDel": 0
      }
    ],
    isShow: false,
    showRename: false,
  }],
  newGroupName: '',
  groupManager: false,
  reName: ""
})
const friendMain = ref(null as unknown as HTMLDivElement)
const menu = ref(null as unknown as HTMLDivElement)

let getList = () => friend.getAllFriedn().then(res => {
  console.log(res);
  friendList.value = res.data.data.map((v: any) => {
    return { ...v, isShow: false, showRename: false }
  });
})
getList()
onMounted(() => {
  console.log('mounted');
})

function openUserInfoHandler(i: any) {

  invoke("set_search_id_command", { userId: i.uid }).then(() =>
    newWindow.newWindow('userInfoView', {
      url: "/userFriendInfo",
      width: 580,
      height: 380,
      title: '好友信息',
      center: true,
    })
  )
}

listen('userInfoView_close', () => {
  setTimeout(() => getList(), 100)
})


function addFriend() {
  newWindow.newWindow('addFriend', {
    url: '/addFriend',
    width: 600,
    height: 300,
    title: '添加好友',
    resizable: false,
    fullscreen: false,
  })
}


function addNewGroup() {
  friend.addNewFriendGroup(newGroupName.value).then(res => {
    getList()
  })
}

function deleteGroup(groupName: string) {
  friend.deleteFriendGroup(groupName).then(res => {
    getList()
  })
}

function showRenameHandler(i: any) {
  friendList.value.forEach(v => {
    v.showRename = false
  })
  reGroupName.value = i.groupName
  i.showRename = !i.showRename
}

function reGroupNameHandler(i: any) {
  friend.reNameFriendGroup(i.groupName, reGroupName.value).then(res => {
    getList()
  })
}

// //右键菜单
// const menutest = (e: any, groupName: string) => {
//   console.log(e, groupName)
//   let x = e.pageX;
//   let y = e.pageY;
//   console.log(x, y);
//   menu.value.style.left = x + 'px';
//   menu.value.style.top = y + 'px';
//   menu.value.style.display = 'block';
// }

const { friendList, groupManager, newGroupName, reName: reGroupName } = toRefs(state)
</script>
<style lang="scss" scoped>
.friendMain {
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

      .addGroup {
        margin-right: 10px;
        display: flex;
        gap: 10px;
      }
    }
  }

  .friendList {
    margin-top: 10px;
    flex: 99;
    overflow-y: auto;

    .friendGroup {
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
          position: relative;

          .delGroupButton {
            display: flex;
          }

          .renameBlock {
            border: 1px solid #e5e5e5;
            border-radius: 5px;
            z-index: 999;
            background-color: #fff;
            position: absolute;
            bottom: -80px;
            left: -30px;
            cursor: default;

            .renameTitle {
              background-color: #f1f1f1;
              color: #000;
              font-size: 14px;
            }

            input {
              width: 100%;
              height: 30px;
              border: none;
              border-bottom: 1px solid #e5e5e5;
              outline: none;
              padding: 0 10px;
            }

            .buttons {
              display: grid;
              grid-template-columns: repeat(2, 1fr);

              :deep(.mybutton) {
                margin: 0;
              }
            }
          }

        }
      }

      .friendGroupList {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-left: 10px;

        .friendGroupListItem {
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