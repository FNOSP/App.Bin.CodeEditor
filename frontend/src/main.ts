import { createApp } from 'vue'
import { Buffer } from 'buffer'

import App from './App.vue'

import 'normalize.css'

import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
;(window as any).Buffer = Buffer

createApp(App).mount('#app')
