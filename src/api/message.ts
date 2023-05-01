import request from "@/utils/request";

export default {
    getMessageList: (sessionId: string) => request.get("/message/getMessageList", { sessionId }),
}