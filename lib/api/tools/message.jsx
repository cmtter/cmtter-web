import { createVNode } from 'vue'
import { Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

const model_defaults = {
  confirm: {
    title: '操作确认',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确定要执行该操作吗?',
    okText:'确认',
    cancelText: '取消',
  },

  info: {
    title: '消息提示',
    content: '-'
  },
  success: {
    title: '成功提示',
    content: '-'
  },
  error: {
    title: '错误提示',
    content: '-'
  },
  warning: {
    title: '警告提示',
    content: '-'
  }
}

function _model(type){
  return (options) =>{
    return new Promise((resolve) => {
      Modal[type]({
        ...(model_defaults[type]),
        ...options,
        onOk:() => resolve(true),
        onCancel: () => resolve(false)
      }) 
    });
  }
}

export const confirm = _model('confirm')
export const info =  _model('info')
export const success = _model('success')
export const error = _model('error')
export const warning = _model('warning')
