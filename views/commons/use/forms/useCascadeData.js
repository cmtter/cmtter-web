import { watch, reactive, computed, toRefs } from 'vue'
import composition from '@lib/api/composition'
import debounce from 'lodash-es/debounce'
import objectProperty from '@lib/api/tools/object-property'
/**
 * 
 * setup() {
    const { http } = composition.useHttp();
    const { dataList, states } = useCascadeData([['prodType', 'prodType1'], ['user', 'user1'], ['prod', 'prod1']], [
      ['post', '/mock/ui/getSelectList', 'datas'],
      ['post', '/mock/ui/getSelectList', 'datas'],
      ['post', '/mock/ui/getSelectList', 'datas']
    ], {})()

    const formStates = reactive({
      ...(defineStates.formStates),
      searcForm: {
        ...(defineStates.formStates.searcForm),
        ...(toRefs(states))
      }
    })
    const formDataList = dataList

    return {
      http,
      confirm,
      warning,
      error,
      success,
      formStates,
      formDataList,
      states
    };
    }
 * 
 * @param {*} http 
 * @param {*} defauParams 
 * @param {*} key 
 * @param {*} value 
 * @param {*} dataTarget 
 * @returns 
 */

async function loadDatas(http, defauParams, key, value, dataTarget) {
  console.log(defauParams, key, value, dataTarget);
  const r = await http(dataTarget[1],
    {
      ...(defauParams || {}),
      ...((value !== null && value === undefined) ? { key: value } : {})
    }
  )[dataTarget[0]]()
  if (dataTarget[2]) {
    return objectProperty(r.response, dataTarget[2], dataTarget[3])
  } else {
    return r.response
  }
}

//stateChains = [[v, f], [v, f]]
export default function (stateChains, dataTargets, defauParams) {
  defauParams = defauParams || {}
  return function () {
    const { http } = composition.useHttp()
    const dataList = reactive(stateChains.reduce((memo, s) => {
      memo[s[0]] = null
      return memo
    }, {}))

    const states = reactive(stateChains.reduce((memo, s) => {
      memo[s[0]] = null
      return memo
    }, {}))

    const watchComputer = computed(() => {
      return stateChains.map(k => states[k[0]])
    })

    const loadFirst = async function () {
      const ss = stateChains[0]
      const datas = await loadDatas(http, (defauParams[ss[0]] || {}), (ss[1] || ss[0]), null, dataTargets[0])
      dataList[ss[0]] = datas
    }

    const doCascadeHandler = debounce(async (current, prevCurrent) => {
      let needClearStartIndex = -1

      // 加载第一条
      for (let i = 0; i < stateChains.length; i++) {
        //处理需要清空数据的级联项
        if (needClearStartIndex === -1 && !current[i]) {
          needClearStartIndex = i
        }
      }

      // 同步数据
      for (let i = 1; i < stateChains.length; i++) {
        const s = stateChains[i]
        if (needClearStartIndex !== -1 && i > needClearStartIndex) {
          dataList[s[0]] = []
          states[s[0]] = null
          continue
        }

        //更新数据
        if (!prevCurrent[i - 1] || current[i - 1].value !== prevCurrent[i - 1].value) {
          const press = stateChains[i - 1]
          const ss = stateChains[i]
          const datas = await loadDatas(http, (defauParams[ss[0]] || {}), (press[1] || press[0]), current[i - 1].value, dataTargets[i])
          dataList[s[0]] = datas
          states[ss[0]] = null
        }

      }

    }, 200)

    watch(watchComputer, doCascadeHandler)


    // 监听控件状态
    watch(watchComputer)

    loadFirst()

    doCascadeHandler.flush()
    // 返回数据
    let _a = toRefs(dataList)
    let _b = toRefs(states)
    const _dataList = {}
    const _states = {}
    for (let i = 0; i < stateChains.length; i++) {
      _dataList[stateChains[i][0]] = _a[stateChains[i][0]]
      _states[stateChains[i][0]] = _b[stateChains[i][0]]
    }
    return {
      dataList: reactive(_dataList),
      states: reactive(_states)
    }
  }
}
