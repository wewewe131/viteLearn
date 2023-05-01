import request from "@/utils/request";

export default {
    login: (userId: string, password: string) => request.post("/userAuth", { userId, password }),
    regist: (uname: string, password: string, usex: string) => request.post("/userAuth/register", { uname, password, usex }),
    getUserInfo: () => request.get("/user"),
    logout: () => request.post("/userAuth/logout", {}),
    updateUserInfo: (data: any) => request.put("/user", data),
    updateAvatar: (formData: any) => request.upload("/reAvatar", formData),
    rePassword: (oldPassword: string, newPassword: string) => request.put("/user/rePassword", { oldPassword, newPassword }),
}