/**
 * 请求超时
 * @param {*} response 
 * @param {*} orgReponse 
 * @param {*} timeout 超时毫秒
 * @param {*} message 错误消息
 */
function Plugin(preConfig, resouceConfig, timeout, message) {
    if (typeof timeout === 'number'){
        return {
            ...preConfig,
            timeout: timeout,
            timeoutErrorMessage: (message || '抱歉! 操作超时')
        }
    }
    return preConfig;
}

export default {
    name: 'timeout',
    fn: Plugin
};