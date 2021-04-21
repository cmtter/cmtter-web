import { inject } from 'vue'
import { ROUTER_PAGE_LOADING_SYMBOL } from '../global-symbol'
export default function () {
  return inject(ROUTER_PAGE_LOADING_SYMBOL, () => { })
}