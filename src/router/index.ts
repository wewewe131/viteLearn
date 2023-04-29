import { createRouter, createWebHistory } from 'vue-router'

// @ts-ignore
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/layout',
      name: "layout",
      component: () => import('@/views/LayoutView.vue'),
      children: [
        {
          // 创建一个聊天框的路由
          path: 'chat',
          name: 'chat',
          component: () => import('@/views/chat/ChatView.vue'),
          meta: {
            layout: 'chat',
            title: 'Chat',
            auth: true
          }
        },
        // 好友列表
        {
          path: 'friendList',
          name: 'friendList',
          component: () => import('@/views/friends/FriendList.vue'),
          meta: {
            layout: 'friendList',
            title: 'friendList',
            auth: true
          }
        },
        {
          path: 'groupList',
          name: 'groupList',
          component: () => import('@/views/group/GroupList.vue'),
          meta: {
            layout: 'groupList',
            title: 'groupList',
            auth: true
          }
        },
        {
          path: 'sessionList',
          name: 'SessionList',
          component: () => import('@/views/sessionList/SessionList.vue'),
          meta: {
            layout: 'SessionList',
            title: 'SessionList',
            auth: true
          }
        },
        {
          path: 'applyList',
          name: 'applyList',
          component: () => import('@/views/apply/ApplyList.vue'),
          meta: {
            layout: 'applyList',
            title: 'applyList',
            auth: true
          }
        },
        {
          path: 'userCenter',
          name: 'UserCenter',
          component: () => import('@/views/Usercenter/userCenter.vue'),
          meta: {
            layout: 'userCenter',
            title: 'userCenter',
            auth: true
          }
        },
        {
          path: 'setting',
          name: 'setting',
          component: () => import('@/views/setting/SettingView.vue'),
          meta: {
            layout: 'setting',
            title: 'setting',
            auth: true
          }
        },

      ]
    },
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/login/LoginView.vue'),
      meta: {
        layout: 'login',
        title: 'Login',
        auth: false
      }
    },
    {
      path: '/changeAvatar',
      name: 'changeAvatar',
      component: () => import('@/views/Usercenter/changeAvatar/changeAvatar.vue'),
      meta: {
        auth: true
      }
    },
    {
      path: '/changePassword',
      name: 'changePassword',
      component: () => import('@/views/Usercenter/changePassword/changePassword.vue'),
      meta: {
        auth: true
      }
    },
    {
      path: '/changeUsername',
      name: 'changeUsername',
      component: () => import('@/views/Usercenter/changeUsername/changeUsername.vue'),
      meta: {
        auth: true
      }
    },
    {
      path: '/changeSignature',
      name: 'changeSignature',
      component: () => import('@/views/Usercenter/changeSignature/changeSignature.vue'),
      meta: {
        auth: true
      }
    },
    {
      path: "/groupInfo/:groupId",
      name: "groupInfo",
      component: () => import('@/views/info/groupInfoView.vue')
    },
    {
      path: "/joinGroup",
      name: "joinGroup",
      component: () => import('@/views/group/JoinGroup.vue')
    },
    {
      path: "/addFriend",
      name: "addFriend",
      component: () => import('@/views/friends/AddFriend.vue')
    },

    {
      path: "/userFriendInfo",
      name: "userFriendInfo",
      component: () => import('@/views/info/userInfoView.vue')
    },
    {
      path: "/createGroup",
      name: "createGroup",
      component: () => import('@/views/group/CreateGroup.vue')
    }
  ]
})

export default router
