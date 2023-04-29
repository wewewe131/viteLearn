#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::{Manager, WindowBuilder, WindowUrl, Window, Runtime};

static LOGIN_USER: Mutex<String> = Mutex::new(String::new());
static SEARCH_ID: Mutex<String> = Mutex::new(String::new());
#[tauri::command]
fn set_login_user_id_command(user_id: String) {
    let mut login_user_id: std::sync::MutexGuard<String> = LOGIN_USER.lock().unwrap();
    *login_user_id = user_id;
    println!("设置登陆用户ID:{login_user_id}");
    drop(login_user_id);
}

#[tauri::command]
fn set_search_id_command(user_id: String) {
    let mut user_id_m: std::sync::MutexGuard<String> = SEARCH_ID.lock().unwrap();
    *user_id_m = user_id;
    println!("设置用户ID:{user_id_m}");
    drop(user_id_m);
}

#[tauri::command]
fn get_login_user_id_command() -> String {
    let login_user_id: std::sync::MutexGuard<String> = LOGIN_USER.lock().unwrap();
    println!("{login_user_id}");
    let str: String = login_user_id.to_string();
    drop(login_user_id);
    str.into()
}

#[tauri::command]
fn get_search_id_command() -> String {
    let user_id: std::sync::MutexGuard<String> = SEARCH_ID.lock().unwrap();
    println!("{user_id}");
    let str: String = user_id.to_string();
    drop(user_id);
    str.into()
}

#[tauri::command]
async fn create_window(app: tauri::AppHandle, url: String,label: String,title: String,width: f64,height:f64,fullscreen:bool){
  let window = tauri::WindowBuilder::new(&app, label, tauri::WindowUrl::App(url.parse().unwrap()))
    .title(title)
    .inner_size(width, height)
    .fullscreen(fullscreen)
    .center()
    .resizable(false)
    .build()
    .unwrap();
}
#[tauri::command]
async fn close_window<R: Runtime>(app: tauri::AppHandle<R>,label: String) -> Result<(), String> {
    app.get_window(&label).unwrap().close().unwrap();
    Ok(())
}

#[derive(Serialize, Deserialize)]
struct Configs {

}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            set_login_user_id_command,
            get_login_user_id_command,
            set_search_id_command,
            get_search_id_command,
            create_window,
            close_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
