<template>
    <div class="createGroupMain">
        <!-- 创建群聊 -->
        <el-form v-if="showForm" class="form" :model="form" :rules="rules" label-width="80px" :inline="false" size="small">
            <el-form-item label="群名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="简介">
                <el-input type="textarea" v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item>
                <MyButtonVue size="1.5" @click="onSubmit">创建</MyButtonVue>
                <MyButtonVue size="1.5" @click="cancle">取消</MyButtonVue>
            </el-form-item>
        </el-form>
        <div v-else class="info">
            <div>创建成功</div>
            <div class="groupId">
                <div>群号:</div>
                <div>{{ form.groupId }}</div>
            </div>
            <MyButtonVue size="1.5" @click="cancle">完成</MyButtonVue>
        </div>
    </div>
</template>
<script lang="ts" setup>
import group from '@/api/group';
import MyButtonVue from '@/components/MyButton.vue';
import { emit, listen } from '@tauri-apps/api/event';
import { appWindow } from '@tauri-apps/api/window';
import { reactive, toRefs } from 'vue';

listen("createGroupClose", () => {
    appWindow.close()
})
listen("closeAllWindow", () => {
    appWindow.close()
})
let store = reactive({
    rules: {
        name: [
            { required: true, message: '请输入群名称', trigger: 'blur' },
        ],
        description: [
            { required: true, message: '请输入群描述', trigger: 'blur' },
        ],
    },
    form: {
        name: '',
        description: '',
        groupId: ''
    },
    showForm: true
})
let { form, rules, showForm } = toRefs(store)

function onSubmit() {
    group.createGroup(form.value.name, form.value.description).then(res => {
        console.log(res)
        form.value.groupId = res.data.data.groupId
        showForm.value = false
        emit("reloadGroupList")
    })
}
function cancle() {
    appWindow.close()
}

</script>
<style lang="scss" scoped>
.createGroupMain {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .groupId {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;

            div {
                margin: 0 10px;
            }
        }

        >div:first-child {
            margin-bottom: 20px;
            font-weight: bold;
        }
    }
}

.form {
    width: 85%;
}
</style>