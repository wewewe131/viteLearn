<template>
    <div class="main">
        <input id="inputFile" type="file" accept=".png,.jpg" @change="changeAvatar" ref="fileInput">
        <img @click="updateClick" :src="fileInput" width="250" height="250" ref="showImage">
        <MyButton size="3" @click="clickevent">提交</MyButton>
    </div>
</template>
<script lang="ts" setup>
import login from '@/api/login';
import MyButton from '@/components/MyButton.vue';
import config from '@/config/config';
import { invoke } from '@tauri-apps/api';
import { emit, listen } from '@tauri-apps/api/event';
import { appWindow } from '@tauri-apps/api/window';
import { ElLoading } from 'element-plus';
import { onMounted, reactive, ref, toRefs } from 'vue';

let state = reactive({
    fileInput: null as any,
    imageBase64Cache: null as any
})

let { fileInput, imageBase64Cache } = toRefs(state)

let showImage = ref(null as any)
onMounted(() => {
    console.log(showImage.value);
})
invoke("get_login_user_id_command").then(res => {
    login.getUserInfo().then(res => {
        console.log(res);
        showImage.value.src = config.filePath+"avatar/"+res.data.data.uavatar
    })
    console.log(res);
})
let updateClick = () => {
    document.getElementById('inputFile')?.click()
}

let clickevent = (e: any) => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    let data = new FormData()
    data.append('file', imageBase64Cache.value)
    console.log(imageBase64Cache.value);
    login.updateAvatar({ "file": imageBase64Cache.value }).then(res => {
        console.log(res);
        loading.close()
        emit('UserInfoChangeSuccess', res.data.data)
    })
}

let changeAvatar = (e: any) => {
    let readFile = new FileReader()
    console.log(e.target.files[0]);
    readFile.readAsDataURL(e.target.files[0])
    readFile.onload = (e: any) => {
        showImage.value.src = e.target.result
        imageBase64Cache.value = e.target.result
        console.log(showImage.value.src);
    }
}

listen("changeAvatarClose", () => {
    console.log('close');
    appWindow.close()
})
listen("closeAllWindow", () => {
    appWindow.close()
})
</script>
<style lang="scss" scoped>
.main {
    height: 100%;
    widows: 100%;
    background-color: #fff;
    display: flex;
    justify-content: center;
    flex-direction: column;
    #inputFile{
        display: none;
    }
    img {
        height: 300px;
        width: 300px;
        cursor: pointer;
    }
}
</style>