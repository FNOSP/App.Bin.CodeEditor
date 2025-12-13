import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Buffer } from 'buffer'

import App from './App.vue'

import 'normalize.css'

import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import '@/utils/monaco'
;(window as any).Buffer = Buffer

createApp(App).use(createPinia()).mount('#app')
