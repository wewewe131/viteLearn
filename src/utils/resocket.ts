import { invoke } from "@tauri-apps/api/tauri";

export default {
    socket: async () => {
        const uid = await invoke("get_login_user_id_command").then(res => res)
        return new WebSocket('ws://localhost:8080/api/socket/mainLink', [localStorage.getItem(`${uid}token`) as string])
    }

}