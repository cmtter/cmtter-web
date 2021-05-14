/**
 * 使用方式:
 *   <div v-show-overflow-tooltip> context </div>
 * 解释:
 *  若context长度 > div长度，则显示 tooltip
 * 
 */
import { createApp } from 'vue'
import addEventListener from 'ant-design-vue/es/vc-util/Dom/addEventListener'
import {monitorResize} from 'ant-design-vue/es/vc-align/util'
import Tooltip from 'ant-design-vue/es/vc-tooltip/index'
import debounce from 'lodash-es/debounce'
import './style.scss'

function getStyle(element, styleName) {
  if (styleName === 'float') {
    styleName = 'cssFloat';
  }
  try {
    var computed = document.defaultView.getComputedStyle(element, '');
    return element.style[styleName] || computed ? computed[styleName] : null;
  } catch (e) {
    return element.style[styleName];
  }
}

function addClass(el, className){
  if (el.classList && !el.classList.contains(className)){
    el.classList.add(className)
  }
}

function removeClass(el, className){
  if (el && el.classList){
    el.classList.remove(className)
  }
}

// 全局
const vcTooltipInstance = createApp({
  data(){
    return {
      title: ' '
    }
  },
  methods: {
    getOverlay() {
      return this.title
    }
  },
  render(){
    const prefixCls = 'ant-tooltip'
    const props = {
      prefixCls: prefixCls,
      ref: 'tooltip',
      placement: 'top',
      overlay: this.getOverlay(),
      arrowContent: <span class={`${prefixCls}-arrow-content`}></span>,
      alignPoint: true,
      transitionName: 'zoom-big-fast'
    }
    return <Tooltip {...props}></Tooltip>
  }
}).mount(document.createElement('div'))

// 设置400延迟
const handlerMouseenter = debounce(function(event){
  const wantEl = event.target
  const title = wantEl.innerText || wantEl.textContent;
  if (isNeedShowOverflowTooltip(wantEl)){
    vcTooltipInstance.title = title
    vcTooltipInstance.$refs.tooltip.$refs.trigger.onMouseenter(event)
    addClass(wantEl, 'show-overflow-tooltip')
  } else {
    removeClass(wantEl, 'show-overflow-tooltip')
  }
}, 400)

function handlerMouseleave(event){
  vcTooltipInstance.$refs.tooltip.$refs.trigger.onMouseleave(event)
  handlerMouseenter.cancel()
}

function _bindEvent(el){
  _clear(el) 
  addEventListener(el, 'mouseenter', handlerMouseenter)
  addEventListener(el, 'mouseleave', handlerMouseleave)
}

function isNeedShowOverflowTooltip(wantEl){
  const realWidth = wantEl.getBoundingClientRect().width
    const range = document.createRange();
    range.setStart(wantEl, 0);
    range.setEnd(wantEl, wantEl.childNodes.length);
    const rangeWidth = range.getBoundingClientRect().width;
    const padding = (parseInt(getStyle(wantEl, 'paddingLeft'), 10) || 0) + (parseInt(getStyle(wantEl, 'paddingRight'), 10) || 0);
    return (padding + rangeWidth) > realWidth
}

function _clear(el){
  el.removeEventListener('mouseenter', handlerMouseenter)
  el.removeEventListener('mouseleave', handlerMouseleave)
}

function updateStatusForResize(el){
  if (isNeedShowOverflowTooltip(el)){
    addClass(el, 'show-overflow-tooltip')
  } else {
    removeClass(el, 'show-overflow-tooltip')
  }
}

export default {
  name: 'show-overflow-tooltip',
  directive: {
    mounted(el){
      addClass(el, 'show-overflow-tooltip')
      _bindEvent(el)
      el.cancelMonitorResize = monitorResize(el, updateStatusForResize.bind(null, el))
    },
    beforeUnmount(el){
      _clear(el)
      removeClass(el, 'show-overflow-tooltip')
      if (el.cancelMonitorResize){
        el.cancelMonitorResize()
      }
    }
  }
}