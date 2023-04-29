import request from "@/utils/request";

export default {
    sendFriendApply: (applyId: string, mark: string) => request.post("/friend/send", { applyId, mark }),
    getFriendInfo: (uid: string) => request.get("/friend/info", { uid }),
    getAllFriedn: () => request.get("/friend/list"),
    deleteFriend: (userIdFriend: string) => request.delete("/friend/remove", { userIdFriend }),
    addNewFriendGroup: (friendGroup: string) => request.post("/friend/group/add", { friendGroup: friendGroup }),
    deleteFriendGroup: (friendGroup: string) => request.delete("/friend/group/removeGroup", { friendGroup: friendGroup }),
    reNameFriendGroup: (oldFriendGroupName: string, newFriendGroupName: string) => request.put("/friend/group/reGroupName", { oldFriendGroupName, newFriendGroupName }),
    getFriendGroups: () => request.get("/friend/group/list"),
    changeFriendGroup: (userIdFriend: string, friendGroup: string) => request.put("/friend/group/changeGroup", { userIdFriend, friendGroup }),
    getUserInfo: (uid: string) =>request.get("/user/info", { uid })
}