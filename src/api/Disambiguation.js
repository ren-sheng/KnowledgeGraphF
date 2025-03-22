import request from '@/utils/request.js';



// 查询作者实体
export const searchAuthor = (searchText, searchType) => {
    if (searchType === 'name') {
        return getAuthorByName(searchText);
    } else if (searchType === 'institutionName') {
        return getAuthorByInstitutionName(searchText);
    }
    // else if (searchType === 'SC') {
    //     return getAuthorBySC(searchText);
    // } else if (searchType === 'RI') {
    //     return getAuthorByRI(searchText);
    // } else if (searchType === 'OI') {
    //     return getAuthorByOI(searchText);
    // }
}

const url = "Disambiguation"

function getAuthorByName(name) {
    return request.get(url + '/Name', {
        params: {
            name
        }
    });
}

function getAuthorByInstitutionName(institutionName) {
    return request.get(url + '/Institution', {
        params: {
            institutionName
        }
    });
}

// function getAuthorBySC(searchText) {
//     return request.get(url + '/SC', {
//         params: {
//             sc: searchText
//         }
//     });
// }
//
// function getAuthorByRI(searchText) {
//     return request.get(url + '/RI', {
//         params: {
//             ri: searchText
//         }
//     });
// }
//
// function getAuthorByOI(searchText) {
//     return request.get(url + '/OI', {
//         params: {
//             oi: searchText
//         }
//     });
// }

// 全局变量，用于维护节点和连线的 ID
let globalNodeId = 1;
let globalLineId = 1;

export function transformData(dataList) {
    const nodes = [];
    const lines = [];
    const nodeMap = {}; // 用于存储已创建的节点，以避免重复

    // 辅助函数：添加节点
    const addNode = (type, text, color) => {
        // 先检查是否有相同 text 的节点
        const existingNodeByText = nodes.find(node => node.text === text);
        if (existingNodeByText) {
            return existingNodeByText;
        }

        const id = globalNodeId++;
        const newNode = { id: id.toString(), type, text, color };
        nodes.push(newNode);
        nodeMap[id] = newNode;
        return newNode;
    };

    // 辅助函数：添加连线
    const addConnection = (from, to, text) => {
        const existingConnection = lines.find(conn =>
            (conn.from === from && conn.to === to && conn.text === text) ||
            (conn.from === to && conn.to === from && conn.text === text)
        );
        if (!existingConnection) {
            const lineId = globalLineId++;
            lines.push({ id: lineId.toString(), from, to, text,isHideArrow: true,type:"line" });
            // lines.push({ id: (globalLineId++).toString(), from: to, to: from, text });
        }
    };

    dataList.forEach(data => {
        // 处理主作者信息
        const mainAuthorNode = addNode("author_id", data.id.toString(), "#d97706");
        const mainAuthorNameNode = addNode("name", data.name[0], "#16a34a");
        addConnection(mainAuthorNode.id, mainAuthorNameNode.id, null);

        // 处理研究领域（sc）
        if (data.sc){
            data.sc.forEach((field) => {
                const scNode = addNode("sc", field, "#2563eb");
                addConnection(mainAuthorNode.id, scNode.id, null);
            });
        }


        // 处理机构信息（institutions）
        if (data.institutions){
            data.institutions.forEach((institution) => {
                const institutionNode = addNode("institution", institution, "#64748b");
                addConnection(mainAuthorNode.id, institutionNode.id, null);
            });
        }


        // 处理 ri 信息
        // 如果有ri信息再去搞这个
        if (data.ri){
            const riNode = addNode("ri", data.ri, "#db2777");
            addConnection(mainAuthorNode.id, riNode.id, null);
        }


        // 处理 oi 信息
        if (data.oi){
            const oiNode = addNode("oi", data.oi, "#80082d");
            addConnection(mainAuthorNode.id, oiNode.id, null);
        }

        // 处理合作者信息
        if (data.coauthor) {
            data.coauthor.forEach((coauthorName, index) => {
                const collaboratorAuthorId = data.collaborator_author_ids[index].toString();
                const collaboratorAuthorNode = addNode("author_id", collaboratorAuthorId, "#d97706");
                addConnection(mainAuthorNode.id, collaboratorAuthorNode.id, data.paper[0]);
            });
        }

    });

    return {
        nodes,
        lines
    };
}


// 全局变量，用于维护节点和连线的 ID
let globalNodeId2 = 1;
let globalLineId2 = 1;

export function transformData2(dataList) {
    const nodes = [];
    const lines = [];
    const nodeMap = {}; // 用于存储已创建的节点，以避免重复

    // 辅助函数：添加节点
    const addNode = (type, text, color) => {
        // 先检查是否有相同 text 的节点
        const existingNodeByText = nodes.find(node => node.text === text);
        if (existingNodeByText) {
            return existingNodeByText;
        }

        const id = globalNodeId2++;
        const newNode = { id: id.toString(), type, text, color };
        nodes.push(newNode);
        nodeMap[id] = newNode;
        return newNode;
    };

    // 辅助函数：添加连线
    const addConnection = (from, to, text) => {
        const existingConnection = lines.find(conn =>
            (conn.from === from && conn.to === to && conn.text === text) ||
            (conn.from === to && conn.to === from && conn.text === text)
        );
        if (!existingConnection) {
            const lineId = globalLineId2++;
            lines.push({ id: lineId.toString(), from, to, text, isHideArrow: true,type:"line" });
        }
    };

    dataList.forEach(data => {
        // 处理机构信息
        const institutionIdNode = addNode("institution_id", data.institutionId.toString(), "#d97706");
        data.institutionNames.forEach((institutionName) => {
            const institutionNameNode = addNode("institution_name", institutionName, "#64748b");
            addConnection(institutionIdNode.id, institutionNameNode.id, null);
        });

        // 处理作者信息
        data.name.forEach((authorName) => {
            const authorNameNode = addNode("author_name", authorName, "#16a34a");
            addConnection(institutionIdNode.id, authorNameNode.id, null);
        });
    });

    return {
        nodes,
        lines
    };
}
