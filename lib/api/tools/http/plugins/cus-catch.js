import { error as _error } from '../../message'
import { UNKNOW_HTTP_EXCEPTION_CODE } from '../../../global-symbol'

function Plugin(error, cus) {
    if (!cus) {
        const { message = '发生未知错误', code = UNKNOW_HTTP_EXCEPTION_CODE } = error || {}
        console.log('-', code);
        _error(`${message}`)
    } else {
        if (typeof cus.args[0] === 'function') {
            cus.args[0](error)
        }
    }
    return error
}

export default {
    name: 'catch',
    fn: Plugin
};