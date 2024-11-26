import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
//导入element-plus的中文语言包
// import locale from 'element-plus/dist/locale/zh-cn.js'

//不写文件名 默认找index.js 路由
import router from '@/router'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus)

app.use(router)

// import store from '@/store'
// app.use(store)

// 放最后
app.mount('#app')