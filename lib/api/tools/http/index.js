import WhitchException from './plugins/whitchException'
import WhitchData from './plugins/whitchData'
import CusCatch from './plugins/cus-catch'
import CusSuccess from './plugins/cus-success'
import Transform from './plugins/cus-transform'
import requestoptions from './plugins/cus-requestoptions'
import timeout from './plugins/cus-timeout'
import download from './plugins/cus-download'

import api from './request'

api.addResPlugins([WhitchException, WhitchData, Transform, CusSuccess, CusCatch])
api.addReqPlugins([requestoptions, timeout, download])
api.getPlugins = function () {
    return { WhitchException, WhitchData, Transform, CusSuccess, CusCatch }
}

export default api;
