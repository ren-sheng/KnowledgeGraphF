import request from '@/utils/request.js';

const url = "api/authors"

// 搜索作者
export const searchAuthors = (query) => {
    return request.get(`${url}/search`, {
        params: { query }
    });
};

// 获取作者详情
export const getAuthorDetails = (authorId) => {
    return request.get(`${url}/${authorId}`);
};

// 获取作者的论文列表
export const getAuthorPapers = (authorId) => {
    return request.get(`${url}/${authorId}/papers`);
};

// 获取作者的合作关系图
export const getAuthorNetwork = (authorId) => {
    return request.get(`${url}/${authorId}/network`);
}; 