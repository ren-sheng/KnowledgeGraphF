import request from '@/utils/request.js';


const url = "pages"
export const searchPages = (query) => {
    return request.get(url + '/ES_search', {
        // ？？？？？
        params: {query}
    });
}