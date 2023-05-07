import config from '@/config/config';
import { fetch, Body } from '@tauri-apps/api/http';
import { invoke } from '@tauri-apps/api/tauri';
const commonOptions = {
    headers: {
        'authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NjkwMDI1MDgsInVzZXJJZCI6IjEwMDAxMSJ9.Xm_xHKFlhAEatLK02nhCER5aA8U6EMb6rELPbU9Hub8",
        'timeout': "30",
    },
};

const baseUrl = config.backendUrl;


export const post = async (url: string, ...data: any) => {
    let getUid = await invoke("get_login_user_id_command").then(res => res)
    commonOptions.headers.authorization = "Bearer " + localStorage.getItem(`${getUid}token`) || ''

    const res = await fetch(baseUrl + url, {
        ...commonOptions,
        method: 'POST',
        body: data.length ? Body.json(data[0]) : undefined,
    });
    console.log(res, Body.json(data));
    return res as any;
}

export const get = async (url: string, ...data: any) => {
    //调用rust方法
    let getUid = await invoke("get_login_user_id_command").then(res => res)
    commonOptions.headers.authorization = "Bearer " + localStorage.getItem(`${getUid}token`) || ''

    const res = await fetch(baseUrl + url, {
        ...commonOptions,
        method: 'GET',
        query: data[0]
    });
    console.log(res, 12313);
    return res as any;
}

const del = async (url: string, ...data: any) => {

    let getUid = await invoke("get_login_user_id_command").then(res => res)

    commonOptions.headers.authorization = "Bearer " + localStorage.getItem(`${getUid}token`) || ''

    const res = await fetch(baseUrl + url, {
        ...commonOptions,
        method: 'DELETE',
        body: Body.json(data[0]),
    });
    console.log(res);
    return res as any;
}

export const put = async (url: string, ...data: any) => {
    let getUid = await invoke("get_login_user_id_command").then(res => res)
    commonOptions.headers.authorization = "Bearer " + localStorage.getItem(`${getUid}token`) || ''

    const res = await fetch(baseUrl + url, {
        ...commonOptions,
        method: 'PUT',
        body: Body.json(data[0]),
    });
    console.log(res, data);
    return res as any;
}


// 图片上传
export const upload = async (url: string, formData: any) => {
    let getUid = await invoke("get_login_user_id_command").then(res => res)

    commonOptions.headers.authorization = "Bearer " + localStorage.getItem(`${getUid}token`) || ''
    console.log("发送请求前", formData);

    const res = await fetch(baseUrl + url, {
        ...commonOptions,
        method: 'POST',
        body: Body.json(formData),

    });


    // const total = res.headers['content-length']

    // console.log(res,total);
    return res as any;
}

export default {
    post,
    get,
    delete: del,
    put,
    upload
};
