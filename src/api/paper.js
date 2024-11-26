import request from '@/utils/request.js';

// 查询论文
export const searchPapers = (searchText, searchType) => {
    if (searchType === 'title') {
        return getPapersByTitle(searchText);
    } else if (searchType === 'author') {
        return getPapersByAuthor(searchText);
    } else if (searchType === 'abstract') {
        return getPapersByAbstract(searchText);
    }
}

const url = "Papers"

// 通过作者搜索论文
const getPapersByAuthor = (author) => {
    // Query 参数
    return request.get(url + '/ES_searchByAuthor', {
        params: {
            au: author
        }
    });
}

// 通过标题搜索论文
const getPapersByTitle = (title) => {
    return request.get(url + '/ES_searchByTitle', {
        params: {
            ti: title
        }
    });
}

// 通过摘要搜索论文
const getPapersByAbstract = (abstract) => {
    return request.get(url + '/ES_searchByAbstract', {
        params: {
            ab: abstract
        }
    });
}