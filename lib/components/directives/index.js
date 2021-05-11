
import ShowOveFlowTooltip from './show-overflow-tooltip'
export default {
  install(app) {
    app.directive(ShowOveFlowTooltip.name, ShowOveFlowTooltip.directive)
  }
}