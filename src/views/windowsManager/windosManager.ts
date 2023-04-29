import { invoke } from "@tauri-apps/api";
import { emit, listen } from "@tauri-apps/api/event";
import { WebviewWindow, type WindowOptions } from "@tauri-apps/api/window";



export const getByLabel = (label: string) => {
    return WebviewWindow.getByLabel(label)
}


export const newWindow = (label: string, option: WindowOptions) => {
    emit(label + "Close")
    let window: WebviewWindow
    setTimeout(() => {
        window = new WebviewWindow(label, option)

        window.listen(label + "Close", () => {
            window.close()
        })
        window.listen("closeAllWindow", () => {
            window.close()
        })
        return window
    }, 100);

}
export default {
    getByLabel,
    newWindow
}

