<template>
    <div class="setMain">
        <MyButton size="1" @click="logoutHandler">登出</MyButton>
    </div>
</template>
<script lang="ts" setup>
import login from '@/api/login';
import MyButton from '@/components/MyButton.vue';
import config from '@/config/config';
import { UserInfo } from '@/stores/Store';
import { storeToRefs } from 'pinia';

let { userInfo } = storeToRefs(UserInfo())
let logoutHandler = () => {
    login.logout().then(res => {
        config.logout()
    })
}
console.log(userInfo.value);
</script>
<style lang="scss" scoped>
.setMain {
    width: 100%;
    min-height: 100%;
    background-color: #fff;
}
</style>