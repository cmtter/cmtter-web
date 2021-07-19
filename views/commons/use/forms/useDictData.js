import { watch, isProxy, isRef, isReactive, toRaw, ref } from 'vue'
import composition from '@lib/api/composition'

/**
 * 字典数据
 * @author xiufu.wang 
 */
export default function (params = {}, targetUrl, nameFiled = 'datas', method = 'post',) {
  params = params || {}
  return function (watchComputer) {
    const datas = ref(null)
    const { http } = composition.useHttp()
    const loadDatas = async () => {
      const v = toRaw(watchComputer)
      const res = await http(targetUrl, {
        ...v,
        ...params
      })[method || 'post']()
      if (res.response) {
        datas.value = res.response
      }
    }

    if (isProxy(watchComputer) || isRef(watchComputer) || isReactive(watchComputer)) {
      watch(watchComputer, loadDatas)
    }
    loadDatas()

    return {
      [nameFiled]: datas
    }
  }

}