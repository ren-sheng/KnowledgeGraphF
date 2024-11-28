import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'


// https://vite.dev/config/
export default defineConfig({
    server: {
        // 不加这个 只能localhost访问，加了这个 局域网内的ip都可以访问
        host: '0.0.0.0'
    },
    plugins: [vue(),], resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})

