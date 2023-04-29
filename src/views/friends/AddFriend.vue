<template>
    <div class="joinMain">
        <div v-if="showSuccess" class="successBox">
            <div class="success">
                <el-icon color="#aee280" size="50">
                    <CircleCheckFilled />
                </el-icon>
                <div class="successText">{{ msg }}</div>
                <MyButton size="2" bgcolor="#aee280" radius="3px" @click="close()">完成</MyButton>
            </div>
        </div>
        <div v-else class="joinBox">
            <div class="title">发送好友申请</div>
            <div class="inputBox">
                <input type="text" v-model="friendId" placeholder="输入好友ID" />
            </div>
            <div class="inputBox">
                <input type="text" v-model="mark" placeholder="备注(选填)" />
            </div>
            <div class="buttonBox">
                <MyButton size="2" radius="10px" @click="sendFriendApply()">发送</MyButton>
            </div>
        </div>

    </div>
</template>
<script lang="ts" setup>
import { reactive, toRefs } from 'vue';
import MyButton from '@/components/MyButton.vue';
import group from '@/api/group';
import { appWindow } from '@tauri-apps/api/window';
import message from '@/utils/Messge';
import friend from '@/api/friend';
import { listen } from '@tauri-apps/api/event';

listen("addFriendClose", () => {
    appWindow.close()
})
listen("closeAllWindow", () => {
    appWindow.close()
})
const state = reactive({
    friendId: '',
    mark: '',
    showSuccess: false
})

let msg = ""
function sendFriendApply() {
    friend.sendFriendApply(friendId.value, mark.value).then(res => {
        console.log(res, mark.value, friendId.value);
        if (res.data.success == true) {
            state.showSuccess = true
            msg = res.data.data
        }
        else {
            message(msg = res.data.msg, "warning")
        }
    })
}

function close() {
    appWindow.close()
}

let { friendId, showSuccess, mark } = toRefs(state)

</script>
<style lang="scss" scoped>
//根据html代码编写scss

.joinMain {
    height: 100%;
    width: 100%;
    background-color: #f2f2f2;

    .joinBox {
        width: 100%;
        height: 100%;
        background-color: #fff;
        border-radius: 10px;
        margin: 0 auto;

        .title {
            width: 100%;
            height: 50px;
            line-height: 50px;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            border-bottom: 1px solid #f2f2f2;
        }

        .inputBox {
            width: 100%;
            height: 75px;
            display: flex;
            align-items: center;
            justify-content: center;

            input {
                width: 90%;
                height: 40px;
                border: 1px solid #f2f2f2;
                border-radius: 5px;
                padding-left: 10px;
                outline: none;
            }
        }

        .buttonBox {
            width: 100%;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;

            :deep(.mybutton) {
                width: 80%;
            }
        }
    }

    .successBox {
        width: 100%;
        height: 100%;
        background-color: #fff;
        border-radius: 10px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;

        .success {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;

            .successText {
                font-size: 20px;
                font-weight: bold;
                margin-top: 20px;
            }
        }
    }
}
</style>