<template>
    <div class="msgMain">
        <div class="messageList">
            <div id="leftslider" ref="leftslider" v-if="sessionList[0]?.avatar" class="messageItem"
                v-for="(item) in sessionList">
                <img :src="config.filePath + 'avatar/' + item.avatar" height="50" width="50" alt="">
                <div class="info">
                    <div class="messageName">{{ item.receiveName }}</div>
                    <div class="messageInfo">{{ item.lastMessage }}</div>
                </div>
                <div class="active" @mouseup.stop="test">
                    隐藏
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import session from '@/api/session';
import friend from '@/api/friend';
import { invoke } from '@tauri-apps/api';
import config from '@/config/config';
import group from '@/api/group';
import login from '@/api/login';


const state = reactive({
    sessionList: [] as any
})


let { sessionList } = toRefs(state)
async function getSessionList() {
    // 获取会话列表
    await invoke('get_login_user_id_command').then(async uid => {
        console.log(uid);
        await session.getSessionList().then(async session => {
            if (!session.data.data) return
            await session.data.data.map(async (v: any) => {
                v.userId = v.userId + ''
                v.receiveId = v.receiveId + ''
                if (v.sessionType == 'friend') {
                    let id = v.userId == v.receiveId ? v.receiveId : v.userId;
                    await friend.getUserInfo(id).then(friendRes => {
                        v['avatar'] = friendRes.data.data.uavatar
                    })
                }
                if (v.sessionType == 'group') {
                    await group.getGroupInfo(v.receiveId).then(groupRes => {
                        v['avatar'] = groupRes.data.data.group.groupAvatar
                    })
                }
                sessionList.value.push(v)
                console.log("结果", sessionList.value);
                return v
            })
            console.log(sessionList.value);
            return sessionList
        })
    })
}



let router = useRouter()
onMounted(async () => {
    await getSessionList().then(() => {
        setTimeout(() => {
            setSlider()
        }, 100);
    })
})
let leftslider = ref([] as HTMLDivElement[])
let x = 0;
const setSlider = () => {
    console.log(leftslider.value);
    leftslider.value.forEach(i => {
        console.log(i);
        i.addEventListener('mousedown', (e: any) => {
            x = e.pageX
        }, true)
        i.addEventListener('mouseup', (e: any) => {

            let abs = Math.abs(x - e.pageX);
            console.log(abs);

            if (abs < 10 && i.style.marginLeft != '-50px')
                router.push('/layout/chat')


            if (x > e.pageX) {
                console.log(x, e.pageX);
                i.style.marginLeft = '-50px'
                leftslider.value.forEach(j => {
                    if (j !== i) {
                        j.style.marginLeft = '0px'
                    }
                })
            }
            else {
                i.style.marginLeft = '0px'
            }
        }, true)
    })

}

onMounted(() => {
    setSlider()
})
function test() {
    console.log("active");
}
</script>
<style lang="scss" scoped>
.msgMain {
    background-color: #fff;
    height: 100%;
    overflow: hidden;

    .messageList {
        overflow-x: hidden;
        overflow-y: scroll;
        height: 100%;

        .messageItem {
            transition: all 0.2s ease-in-out;

            border-bottom: 1px solid #f1f1f1;
            display: flex;
            align-items: center;
            width: calc(100% + 50px);
            user-select: none;

            .info {
                height: 50px;
                padding-left: 20px;
                width: calc(100% - 50px);
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .messageName {}

                .messageInfo {
                    color: #999;
                    font-size: 13px;
                }
            }

            .active {
                cursor: pointer;
                color: #fff;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #f00;
            }
        }
    }
}
</style>