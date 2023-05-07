import newWindow from "@/views/windowsManager/windosManager";
import { emit } from "@tauri-apps/api/event";

export default {

    backendUrl: "http://localhost:9007/api",
    filePath: "http://localhost:9007/api/file/",
    logout: function logout() {
        newWindow.newWindow('login', {
            url: "/",
            width: 400,
            height: 300,
            resizable: false,
            fullscreen: false,
            title: 'login',
        })
        setTimeout(() => {
            emit('closeAllWindow',{})
        }, 100);
    }
}