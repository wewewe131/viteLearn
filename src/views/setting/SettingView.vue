<template>
    <div class="setMain">
        <MyButton size="1" @click="config.logout()">登出</MyButton>
    </div>
</template>
<script lang="ts" setup>
import MyButton from '@/components/MyButton.vue';
import config from '@/config/config';
import { UserInfo } from '@/stores/Store';
import newWindow from '@/views/windowsManager/windosManager';
import { emit } from '@tauri-apps/api/event';
import { appWindow } from '@tauri-apps/api/window';
import { storeToRefs } from 'pinia';

let { userInfo } = storeToRefs(UserInfo())

console.log(userInfo.value);
</script>
<style lang="scss" scoped>
.setMain {
    width: 100%;
    min-height: 100%;
    background-color: #fff;
}
</style>