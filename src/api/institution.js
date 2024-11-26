import request from '@/utils/request.js';

const url = "Institutions"

export const searchPapers = (encodedqueryString) => {
    return request.get(url+`/InstitutionList?institutionName=${encodedqueryString}`,{
        params: {
            query: encodedqueryString
        }
    });
}
