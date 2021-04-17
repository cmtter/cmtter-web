/**
 * 请求阶段的参数格式,例如扩展个性化的ajax交互配置
 * @param {*} response
 * @param {*} orgReponse
 * @param {*} cus
 */
function Plugin(preConfig, resouceConfig, options) {
    if (options && typeof options !== 'function') {
        return { ...preConfig, ...options }
    }
    if (typeof options === 'function') {
        return options(preConfig, resouceConfig) || preConfig
    }
    return preConfig;
}

export default {
    name: 'requestOptions',
    fn: Plugin
};
