//再给我整一个http://localhost:5000版本的
import axios from 'axios';
const baseURL2 = 'http://localhost:5000';
const instance2 = axios.create({
    baseURL: baseURL2
})//

export default instance2;
