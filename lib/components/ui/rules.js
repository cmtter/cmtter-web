const TEL_REG = /^0\d{2,3}-?\d{7,8}$/;
const PHONE_REG = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/

const defineRules = {
  // 必填
  isRequired(message = '必填项', trigger = 'blur') {
    return {
      required: true,
      whitespace: true,
      message,
      trigger
    }
  },
  // 字符串长度
  isString(min, max, message = '[字符串]格式不正确', trigger = 'blur') {
    return {
      type: 'string',
      min,
      max,
      trigger,
      message
    }
  },

  // 数字类型
  isNumber(min, max, message = '[数字]格式不正确', trigger = 'blur') {
    return {
      type: 'number',
      transform: (v) => {
        if (v === null || v === undefined || (typeof v === 'string' && v.trim() === '')) {
          return undefined
        }
        if (isNaN(v)) {
          return v
        }
        return Number.parseFloat(v | 0)
      },
      min,
      max,
      trigger,
      message
    }
  },

  // 整数类型
  isInteger(min, max, message = '[整型]格式不正确', trigger = 'blur') {
    return {
      type: 'integer',
      min,
      max,
      trigger,
      message
    }
  },

  // 浮点类型
  isFloat(min, max, message = '[浮点]格式不正确', trigger = 'blur') {
    return {
      type: 'float',
      min,
      max,
      trigger,
      message
    }
  },

  // 正则
  isPattern(pattern, message = '格式不对', trigger = 'blur') {
    return {
      type: 'pattern',
      pattern,
      trigger,
      message
    }
  },

  // 数组
  isArray(min, max, message, trigger = 'blur') {
    return {
      type: 'array',
      min,
      max,
      trigger,
      message
    }
  },

  // 自定义
  isValidator(validateFn, message, trigger = 'blur') {
    if (message === null) {
      message = undefined
    }
    return {
      validator: validateFn,
      trigger,
      message
    }
  },

  // email
  isEmail(message = '邮箱格式不正确', trigger = 'blur') {
    return {
      type: 'email',
      trigger,
      message
    }
  },
  // url
  isUrl(message = 'Url格式不正确', trigger = 'blur') {
    return {
      type: 'url',
      trigger,
      message
    }
  },

  // phone
  isPhone(message = '[手机号/固话]格式不正确', trigger = 'blur') {
    return {
      // rule, value, cb, source, options
      validator(rule, value) {
        if (rule && value && (!TEL_REG.test(value) && !PHONE_REG.test(value))) {
          return Promise.reject(message)
        } else {
          return Promise.resolve()
        }
      },
      trigger,
      message
    }
  }
}

export default defineRules