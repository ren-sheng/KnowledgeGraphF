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

// 获取作者的合作关系图（静态数据）
export const getAuthorNetwork = (authorId) => {
    // 确保 authorId 是字符串类型
    const authorIdStr = String(authorId);
    
    // 返回一个 Promise，模拟 API 调用
    return Promise.resolve({
        data: {
            nodes: [
                {
                    id: authorIdStr,  // 使用字符串类型的ID
                    text: "当前作者",
                    color: "orange",
                    category: 0
                },
                {
                    id: "coauthor1",
                    text: "合作者 1",
                    category: 1
                },
                {
                    id: "coauthor2",
                    text: "合作者 2",
                    category: 1
                },
                {
                    id: "coauthor3",
                    text: "合作者 3",
                    category: 1
                }
            ],
            lines: [
                {
                    from: authorIdStr,  // 使用字符串类型的ID
                    to: "coauthor1"
                },
                {
                    from: authorIdStr,  // 使用字符串类型的ID
                    to: "coauthor2"
                },
                {
                    from: authorIdStr,  // 使用字符串类型的ID
                    to: "coauthor3"
                },
                {
                    from: "coauthor1",
                    to: "coauthor2"
                }
            ]
        }
    });
}; 