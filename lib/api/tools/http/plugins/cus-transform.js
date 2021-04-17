function Plugin(response, orgReponse, cus){
    if (typeof cus === 'function'){
        return cus(response) || response
    }
    return response
}

export default {
    name: 'transform',
    fn: Plugin
};