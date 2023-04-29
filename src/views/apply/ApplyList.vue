<template>
    <div class="applyMain">
        <el-tabs v-model="selectMode" type="card" tab-position="top">
            <el-tab-pane label="好友申请" :name="1">
            </el-tab-pane>
            <el-tab-pane label="群聊申请" :name="2">
            </el-tab-pane>
        </el-tabs>

        <div class="applyList" v-if="showApplyList.length > 0">
            <div v-for="(i, index) in showApplyList" class="applyListItem">
                <div class="applyListItemInfo">
                    <div v-if="selectMode == 1">{{ `收到来自${i.userName}的好友请求` }}</div>
                    <div v-else-if="selectMode == 2">{{ `用户${i.userName}申请加入群聊${i.applyId}` }}</div>
                </div>
                <div class="applyListItemButton">
                    <MyButton @click="agreeApply(i.id)" size="1">同意</MyButton>
                    <MyButton @click="refuseApply(i.id)" bgcolor="#ef6464" size="1">拒绝</MyButton>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, onMounted, reactive, toRefs, watchEffect } from 'vue';

import MyButton from '@/components/MyButton.vue';
import { ApplyInfo } from '@/stores/Store';
import apply from '@/api/apply';
import { storeToRefs } from 'pinia';

let applyStore = ApplyInfo()

const state = reactive({
    userApplyList: [
        {
            id: '',
            applyId: '',
            type: '',
            mark: '',
            uid: '',
            userName: ''
        }
    ],
    selectMode: 1
})

// let applyInfo = computed(() => applyStore.getApplyList)

let { applyList } = storeToRefs(applyStore)
console.log(applyList.value);

let showApplyList = computed(() => userApplyList.value.filter(v => v.type == (selectMode.value == 1 ? "friend" : "group")))

let { userApplyList, selectMode } = toRefs(state)

watchEffect(() => {
    userApplyList.value = applyStore.getApplyList
    console.log(userApplyList.value);
})

//同意
function agreeApply(id: string) {

    apply.agreeApply(id).then(res => {
        console.log(res);
        apply.getApplyInfo().then(res => {
            applyList.value = res.data.data
        })
    })

    console.log(id)
}
//拒绝
function refuseApply(id: string) {
    apply.refuseApply(id).then(res => {
        console.log(res);
        apply.getApplyInfo().then(res => {
            applyList.value = res.data.data
        })
    })
    console.log(id)
}


</script>
<style lang="scss" scoped>
.applyMain {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #fff;

    .applyList {
        overflow-y: scroll;
        height: 100%;
        border: 1px solid #e5e5e5;
        margin-top: -14px;

        .applyListItem {
            padding: 5px 10px;
            border-bottom: 1px solid #e5e5e5;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .applyListItemInfo {
                display: flex;

                .applyListItemName {}

                .applyListItemMark {}
            }

            .applyListItemButton {
                display: flex;
            }
        }
    }
}
</style>