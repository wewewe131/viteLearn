import request from "@/utils/request";

export default {
    createGroup: (groupName: string, groupDescription: string) => request.post("/group", { groupName, groupDescription }),
    getGroupInfo: (groupId: string) => request.get("/group/getGroupInfo/" + groupId),
    deleteGroup: (groupId: string) => request.post("/group/deleteGroup", { groupId }),
    exitGroup: (groupId: string) => request.post("/group/exitGroup", { groupId }),
    updateGroupInfo: (group: {
        "groupId"?: any,
        "groupName"?: any,
        "groupDescription"?: any,
        "status"?: any,
        "isDel"?: any,
        "createTime"?: any,
        "updateTime"?: any
    }) => request.post("/group/updateGroupInfo", group),
    updateGroupUserRelation: (groupId: {
        "relationId"?: string,
        "uid"?: string,
        "groupid"?: string,
        "authId"?: string,
        "createTime"?: string,
        "updateTime"?: string,
        "isDel"?: string
    }) => request.post("/group/updateGroupUserRelation", groupId),
    getGroupGrouping: () => request.get("/group/getAllGroupInfo"),
    joinGroup: (groupId: string, mark: string) => request.post("/group/joinGroup", { groupId, mark }),
    removeUserInGroup: (groupId: string, uid: string) => request.post("/group/removeGroupUser", { groupId, uid }),
    updateGroupAvatar: (groupId:string,file:String) => request.post("/updateGroupAvatar", { groupId, file }),
}