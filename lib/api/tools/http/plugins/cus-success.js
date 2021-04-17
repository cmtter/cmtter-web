import { success } from '../../message'


function Plugin(response, orgReponse, message) {
    if (message) {
        success(`${message}`)
    }
    return response
}

export default {
    name: 'success',
    fn: Plugin
};