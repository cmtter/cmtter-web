const props = {
  ui: 'asteps',
  current : null,
  onUpdate_current : null
}

const children = [
  {
    tag: 'ASteps.Step',
    props: {
      title:'第一步',
      description: '当前阶段描述'
    }
  },
  {
    tag: 'ASteps.Step',
    props: {
      title:'第二步',
      description: '当前阶段描述'
    }
  },
  {
    tag: 'ASteps.Step',
    props: {
      title:'第三步',
      description: '当前阶段描述'
    }
  },
  {
    tag: 'ASteps.Step',
    props: {
      title:'第四步',
      description: '当前阶段描述'
    }
  },
  {
    tag: 'ASteps.Step',
    props: {
      title:'第五步',
      description: '当前阶段描述'
    }
  },
  {
    tag: 'ASteps.Step',
    props: {
      title:'第六步',
      description: '当前阶段描述'
    }
  }

]

const slots = {}

const tag = 'asteps'

const tagText = 'steps步骤条'

export default {
  tag,
  props,
  slots,
  children,
  tagText
}

