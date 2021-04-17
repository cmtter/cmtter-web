/**
 * ajax下载处理
 * 服务端响应规范:
 * 仅支持get模式
 * 如果是post模式需要服务端处理
 *
 * @author xiufu.wang
 */
import { saveAs } from 'file-saver';
import { stringify } from 'qs';
import createError from 'axios/lib/core/createError'
import axios from 'axios';
import { error } from '../../message'
import { UNKNOW_HTTP_EXCEPTION_CODE, HTTP_EXCEPTION_POLICY as httpExceptionPolcy } from '../../../global-symbol'

function getFileName(headers, defaultFile) {
    var disposition = headers['content-disposition'] || headers['Content-Disposition']
    if (disposition && disposition.indexOf('attachment') !== -1) {
        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        var matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
            return matches[1].replace(/['"]/g, '');
        }
    }
    return defaultFile
}

function Plugin(preConfig, resouceConfig, forDownload, urlParamPrefix) {
    urlParamPrefix = urlParamPrefix || ''
    if (forDownload !== true) {
        return preConfig
    }
    if (preConfig.method === 'get') {
        const _params = stringify(preConfig.params || {}, { arrayFormat: 'repeat', strictNullHandling: true })
        try {
            saveAs(`${preConfig.url}${urlParamPrefix} ${_params}`)
        } catch (e) {
            return {
                isLogin: true,
                isException: true,
                expInfo: `下载失败[${e.message}]`
            }

        }
        // 故意抛出异常 终止ajax请求
        throw createError('', preConfig, UNKNOW_HTTP_EXCEPTION_CODE, this, null)

    } else {
        preConfig.responseType = 'blob';
        const _transformResponse = preConfig.transformResponse
        preConfig.transformResponse = [function (data, headers) {
            try {
                const err = httpExceptionPolcy(data)
                if (err) {
                    return data
                }
                // 检测下载结果是否异常
                if (data instanceof Blob) {
                    const _url = URL.createObjectURL(data);
                    axios.get(_url).then(function (response) {
                        const err = httpExceptionPolcy(response)
                        if (err) {
                            error('下载失败')
                            return
                        }
                        // 开始下载
                        saveAs(data, decodeURI(getFileName(headers, 'download.xlsx')))
                    })
                }
            } catch (e) {
                return {
                    isLogin: true,
                    isException: true,
                    expInfo: `下载失败[${e.message}]`
                }
            }

        }, _transformResponse[_transformResponse.length - 1]]
    }

    return preConfig
}

export default {
    name: 'download',
    fn: Plugin
};
