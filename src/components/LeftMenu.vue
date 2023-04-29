<template>
  <div class="menuMain">
    <div ref="sliderblock" class="sliderblock"></div>
    <div class="itemBox">
      <div @click="router.push(item.path)" class="item" v-for="item in menuList">
        {{ item.name }}
      </div>
    </div>

  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router';
const state = reactive({
  menuList: [
    {
      name: "聊天列表",
      path: "/layout/sessionList"
    },
    {
      name: "好友列表",
      path: "/layout/friendList"
    },
    {
      name: "群聊列表",
      path: "/layout/groupList"
    },
    {
      name: "申请列表",
      path: "/layout/applyList"
    },
    {
      name: "用户中心",
      path: "/layout/userCenter"
    },
    {
      name: "设置",
      path: "/layout/setting"
    },
  ]
})

let { menuList } = toRefs(state)
let sliderblock = ref(null as any)
let router = useRouter()
let route = useRoute()

watchEffect(() => {
  let index = menuList.value.findIndex(item => item.path === route.fullPath)
  if (sliderblock.value)
    sliderblock.value.style.top = 50 * index + "px"
})

</script>
<style lang="scss" scoped>
.menuMain {
  // height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-flow: row;
  background-color: transparent;
  position: relative;

  .sliderblock {
    position: absolute;
    // z-index: -1;
    width: 100%;
    height: 50px;
    background-color: #dfdfdfa1;
    transition: all 0.1s ease-in-out;
  }

  .itemBox {
    z-index: 1;

    .item {
      background-color: transparent;
      height: 50px;
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 0px 15px;
      //渐变过渡效果
      // transition: all 0.1s ease-in-out;

      >a {
        text-decoration: none;
        color: #000000;
      }

      &:hover {
        background-color: #dfdfdfa1;
      }
    }
  }
}
</style>