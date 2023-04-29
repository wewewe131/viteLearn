import request from "@/utils/request";

export default {
    getApplyInfo: () => request.get("/apply"),
    agreeApply: (applyId: string) => request.post("/apply/agree", { applyId}),
    refuseApply: (applyId: string) => request.post("/apply/refuse", { applyId}),
}