import { ElMessage } from "element-plus";
import { h } from "vue";

const message = (msg: string, type: "success" | "warning" | "error" | "info") => ElMessage(
    {
        message: h('div',
            {
                style: {
                    fontSize: '12px'
                }
            },
            msg),
        type
    }
)

export default message