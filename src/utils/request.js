//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
//定义一个变量,记录公共的前缀  ,  baseURL
const baseURL = 'http://localhost:9000';
// const baseURL = '/api';
const request = axios.create({
    baseURL,  // 直接使用后端地址
    timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么
        return config
    },
    error => {
        // 对请求错误做些什么
        console.error('请求错误:', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        return response
    },
    error => {
        // 对响应错误做些什么
        if (error.response) {
            // 服务器返回了错误状态码
            console.error('响应错误状态码:', error.response.status)
            console.error('响应错误数据:', error.response.data)
        } else if (error.request) {
            // 请求发出去了但没有收到响应
            console.error('没有收到响应:', error.request)
        } else {
            // 请求配置出错
            console.error('请求配置错误:', error.message)
        }
        return Promise.reject(error)
    }
)

export default request;

//
