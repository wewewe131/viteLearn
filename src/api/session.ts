import request from "@/utils/request";

export default {

    getSessionList: () => request.get('/session/getSessionList'),
    createSession: (data: {
        "lastMessage"?: any,
        "userId"?: any,
        "receiveId"?: any,
        "receiveName"?: any,
        "sessionType"?: any,
    }) => request.post('/session/createSession', data),
    getSessionInfo: (sessionId: string) => request.get('/session/getSessionInfo', { sessionId })

}