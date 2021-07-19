import { watch, isProxy, isRef, isReactive, toRaw, ref } from 'vue'
import composition from '@lib/api/composition'

export default function useDatas(targetUrl, watchComputer, nameFiled = 'datas', method = 'post') {
  const datas = ref(null)
  const { http } = composition.useHttp()
  const loadDatas = async () => {
    const res = await http(targetUrl, toRaw(watchComputer))[method || 'post']()
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