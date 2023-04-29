import { defineStore } from "pinia";

export const UserInfo = defineStore('userInfo', {
  state: () => ({
    userInfo: {
      userId: '123',
      userName: '',
      userSex: '',
      userAvatar: '',
      signature: ''
    }
  }),
  getters: {
    getUserInfo: (state) => {
      return state.userInfo
    }
  },
  actions: {
    setUserInfo(userInfo: any) {
      this.userInfo.userAvatar = userInfo.userAvatar
      this.userInfo.userId = userInfo.userId
      this.userInfo.userName = userInfo.userName
      this.userInfo.userSex = userInfo.userSex
      this.userInfo.signature = userInfo.signature
    }
  }
})

export const ApplyInfo = defineStore("applyInfo", {
  state: () => {
    return {
      applyList: [
        {
          id: '',
          applyId: '',
          type: '',
          mark: '',
          uid: '',
          userName: ''
        }
      ]
    }
  },
  getters: {
    getApplyList(state) {
      return state.applyList
    }
  },
  actions: {
    appendApplyList(item: {
      type: '',
      id: '',
      applyId: '',
      mark: '',
      uid: '',
      userName: ''
    }) {
      this.applyList = [...this.applyList, item]
    }
  }
}) 