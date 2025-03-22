import request from '@/utils/flaskrequest.js';

// 上传文件
export function uploadFile(file) {
    if (!file) {
        console.error('请选择一个文件');
        // 返回一个拒绝状态的 Promise，方便调用者统一处理错误
        return Promise.reject(new Error('请选择一个文件'));
    }
    const formData = new FormData();
    formData.append('file', file);

    return request({
        url: '/upload',
        method: 'POST',
        data: formData
    })
        .then(response => {
            console.log(response.data);
            return response.data;
        })
        .catch(error => {
            console.error('上传文件时出错:', error);
            // 重新抛出错误，让调用者可以捕获并处理
            throw error;
        });
}

// 获取阈值和权重
export function getThresholdsWeights() {
    request({
        url: '/get_thresholds_weights',
        method: 'GET'
    })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error('获取阈值和权重时出错:', error);
        });
}

// 设置阈值和权重
export function setThresholdsWeights(nameWeight, scWeight, collaborationWeight, institutionWeight, institutionThreshold = 0.8, authorThreshold = 0.7) {
    const weightSum = nameWeight + scWeight + collaborationWeight + institutionWeight;
    if (weightSum!== 1) {
        console.log(weightSum);
        console.log(nameWeight , scWeight , collaborationWeight , institutionWeight)
        console.error('权重值之和必须为 1');
        return;
    }

    const data = {
        institution_threshold: institutionThreshold,
        author_threshold: authorThreshold,
        name_weight: nameWeight,
        sc_weight: scWeight,
        collaboration_weight: collaborationWeight,
        institution_weight: institutionWeight
    };

    request({
        url: '/set_thresholds_weights',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error('设置阈值和权重时出错:', error);
        });
}

// 获取导入结果
export function getImportResult(index) {
    request({
        url: `/get_import_result/${index}`,
        method: 'GET'
    })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error('获取导入结果时出错:', error);
        });
}

// 获取相似度结果
export function getSimilarityResults() {
    request({
        url: '/get_similarity_results',
        method: 'GET'
    })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error('获取相似度结果时出错:', error);
        });
}

// 获取实体数量比较结果
export function getEntityCountComparison() {
    request({
        url: '/get_entity_count_comparison',
        method: 'GET'
    })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error('获取实体数量比较结果时出错:', error);
        });
}





