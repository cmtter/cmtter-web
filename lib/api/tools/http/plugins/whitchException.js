import createError from 'axios/lib/core/createError'
import { HTTP_EXCEPTION_POLICY as httpExceptionPolcy } from '../../../global-symbol'

function Plugin(response) {
    // const { data, config, status, request } = response
    const err = httpExceptionPolcy(response)
    if (err) {
        //创建异常
        throw createError(err.message, response.config, err.code, err.request, response)
    }
    return response
}
export default {
    name: 'plugin-&-whitchException',
    fn: Plugin
};
