/**
 * 服务请求库
 * @since 2020-06-13
 * @author xiufu.wang
 */

import axios from 'axios';
import createError from 'axios/lib/core/createError'
import { stringify } from 'qs';
import { Promise } from 'core-js';
import objectProperty from '../object-property';

const DEF_PLIGINS = {
    req: {},
    res: {}
}

const DEF_PLIGINS_SORT = {
    req: [],
    res: []
}

class Request {
    constructor(options) {
        this.options = options;
    }

    plugins = { req: {}, res: {} };

    handerRequest(options) {
        const { url, method, data, ...otherOption } = options
        const axiosInstance = axios.create({})
        const that = this
        const onErrorResponse = err => {
            // 处理异常捕获
            DEF_PLIGINS.res['catch'].apply(null, [err, objectProperty(that.plugins, `res.catch`, false)])
            return Promise.reject({ err: err })
        }

        //格式化请求参数
        axiosInstance.interceptors.request.use(function (config) {
            try {
                const requetOptions = DEF_PLIGINS_SORT.req.reduce((memo, item) => {
                    const args = objectProperty(that.plugins, `req.${item}.args`, [])
                    return DEF_PLIGINS.req[item].apply(axiosInstance, [memo, config, ...args])
                }, { ...config })
                return Promise.resolve(requetOptions)
            } catch (error) {

                return Promise.reject(error.toJSON ? error : createError(error.message || error), options, 9999, axiosInstance, {})
            }
        }, undefined)

        //格式化响应结果
        axiosInstance.interceptors.response.use(function (response) {

            try {
                const _response = DEF_PLIGINS_SORT.res.filter(r => r !== 'catch').reduce((memo, item) => {
                    const args = objectProperty(that.plugins, `res.${item}.args`, [])
                    return DEF_PLIGINS.res[item].apply(null, [memo, response, ...args])
                }, response)
                return Promise.resolve({ response: _response })

            } catch (error) {
                return Promise.reject(error)
            }
        }, undefined)

        //格式化异常
        axiosInstance.interceptors.response.use(undefined, error => onErrorResponse(error))

        const _args = (method !== 'get' && method !== 'delete' && method !== 'head' && method !== 'options') ? [url, data, otherOption] : [url, otherOption]
        return axiosInstance[method].apply(axiosInstance, _args).catch(err => {
            return err
        })
    }

    get() {
        return this.handerRequest({
            method: 'get',
            url: this.options.url,
            params: this.options.params
        })
    }

    delete() {
        return this.handerRequest({
            method: 'delete',
            url: this.options.url,
            params: this.options.params
        })
    }

    head() {
        return this.handerRequest({
            method: 'head',
            url: this.options.url,
            params: this.options.params
        })
    }

    options() {
        return this.handerRequest({
            method: 'options',
            url: this.options.url,
            params: this.options.params
        })
    }

    put() {
        return this.handerRequest({
            method: 'put',
            url: this.options.url,
            data: this.options.params
        })
    }

    patch() {
        return this.handerRequest({
            method: 'patch',
            url: this.options.url,
            data: this.options.params
        })
    }

    post() {
        return this.handerRequest({
            method: 'post',
            url: this.options.url,
            data: this.options.params
        })
    }

    postForm() {
        return this.handerRequest({
            method: 'post',
            url: this.options.url,
            data: stringify((this.options.params || {}), { arrayFormat: 'repeat', strictNullHandling: true })
        })
    }

    applyPluginReq(key, fun, args) {
        this.plugins.req[key] = { fn: fun, args: args }
    }

    applyPluginRes(key, fun, args) {
        this.plugins.res[key] = { fn: fun, args: args }
    }
}

export default function api(url, params = {}) {
    if (!url) {
        throw 'url 参数不能为空: api(undefine, {})'
    }
    //process.env.API_PATH
    /**
     * 如果地址前缀为
     */

    if (url[0] === '~' || (url.indexOf('/mock') === 0 ? (url = ('~' + url)) : false)) {
        url = url.slice(1)
    } else {
        let basePath = process.env.VUE_APP_API_PATH
        basePath = basePath.replace(/^"/, '').replace(/"$/, '')
        if (basePath && url.indexOf(basePath) === -1) {
            url = basePath + (basePath[basePath.length] !== '/' && url[0] !== '/' ? '/' : '') + url
        }
    }
    const requestInstance = new Request({ url, params })

    const proxy = new Proxy(requestInstance, {
        get(target, key) {
            // 忽略内置
            if ((DEF_PLIGINS.req[key] || DEF_PLIGINS.res[key]) && key.indexOf('-&-') < 0) {
                return function (...args) {
                    target[DEF_PLIGINS.req[key] ? 'applyPluginReq' : 'applyPluginRes'](key, (DEF_PLIGINS.req[key] || DEF_PLIGINS.res[key]), [...args])
                    return proxy
                }
            }
            const method = typeof target[key] === 'function' ? target[key].bind(target) : target[key]
            if (method) {
                return method
            }
            throw `${key} 方法不存在`
        }
    })
    return proxy
}

api.addResPlugins = function (_plugins, isReplace) {
    if (isReplace === true) {
        DEF_PLIGINS.res = {}
        DEF_PLIGINS_SORT.res = []
    }
    const names = _plugins.map(r => {
        DEF_PLIGINS.res[r.name] = r.fn
        return r.name
    })
    DEF_PLIGINS_SORT.res = names;
}

api.addReqPlugins = function (_plugins, isReplace) {
    if (isReplace === true) {
        DEF_PLIGINS.req = {}
        DEF_PLIGINS_SORT.req = []
    }

    const names = _plugins.map(r => {
        DEF_PLIGINS.req[r.name] = r.fn
        return r.name
    })
    DEF_PLIGINS_SORT.req = names;
}
