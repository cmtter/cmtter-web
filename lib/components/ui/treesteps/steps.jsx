import { defineComponent, ref, nextTick, watch, toRaw, computed} from 'vue'
import { Row, Col, Button} from 'ant-design-vue'
import VueTypes from  'vue-types'
import './style.scss'

function workTree(datas, fn, p){
  datas = Array.isArray(datas) ? datas : [datas]
  for (let i = 0; i < datas.length; i++) {
    const d = datas[i]
    fn(datas[i], (p && p.group), datas)
    if (d.children && d.children.length > 0){
      workTree(d.children, fn, d)
    }
  }
}

const Comp = {
  props: {
    current: VueTypes.any.def(21),
    datas: VueTypes.array.def([])
  },
  setup(props){
    const cref = ref(null)
    const resetHeights = (v) => {
      const allns = cref.value.$el.querySelectorAll('.tree-steps-group-content')
      if (allns){
        allns.forEach(node => {
          node.style.height = v
        })
      }
    }

    const updateLayout = () => {
      resetHeights(cref.value.$el.getBoundingClientRect().height + 'px')
    }

    watch(() => props.datas, () => {
      resetHeights('auto')
      nextTick(() =>{
        updateLayout()
      })
    })

    const datalist = computed(() => {
      const current = props.current
      const datas = JSON.parse(JSON.stringify(toRaw(props.datas)))
      let tag = 0
      workTree(datas, function(item, isGroup, xddatas){
        if (item.group === true){
          return
        }
        if (current === null || current === undefined || current === ''){
          item.status = 'undo'
          return
        }
        if (tag === 0 && isGroup && item.key === current){
          item.status = 'doing'
          tag = 1
          return
        }
        if (tag === 0 && !isGroup && item.key === current){
          xddatas.forEach(r =>{
            r.status = 'doing'
          })
          tag = 1
          return
        }

        if (!item.status && tag === 0 && item.key !== current){
          item.status = 'do'
          return
        }

        if (!item.status && tag === 1 && item.key !== current){
          item.status = 'undo'
          return
        }
        
      })

      return [...datas]
    })

    return {
      cref,
      updateLayout,
      datalist
    }
  },
  methods: {
    renderItems(childs, isGroup, groupItem){
      if (!childs){
        return null
      }
      const classnames = {
        'tree-steps-item': true
      }
      if (isGroup === true){
       return (
          <Row type="flex" align="middle" class="tree-steps-group-content" style={{flexDirection: 'row'}}>
              {
                 childs.map((r, index, arr) => {
                  const lineDesc = groupItem.lineDesc
                  const desc = groupItem.desc
                  groupItem.lineDesc = null
                  groupItem.desc = null
                  const _positionClass = {
                    first: (index === 0 ),
                    laster: (index === (arr.length - 1)),
                    haschildren: (r.children && r.children.length > 0),
                  }
                  const _classnames = {
                    ..._positionClass,
                    ...classnames,
                    do: (r.status === 'do'),
                    undo: (r.status === 'undo'),
                    doing: (r.status === 'doing')
                   }
                    return (
                      <>
                        <Col key={r.key} class={_classnames}>{ r.label}<span class="temp-line"></span><span class="before-temp-line"></span></Col>
                        {
                          r.children && r.children.length > 0 ? (
                            <Col class={{'tree-steps-children': true}}>
                              {this.renderItems(r.children, false)}
                            </Col>
                          ) : null
                        }
                        {(desc ? (<Button class="group-title" type="link">{desc}</Button>) : null)}
                        {(lineDesc ? (<span class="line-to-title">{lineDesc}</span>) : null)}
                      </>
                    )
                 })
              }
          </Row>
        )
      } else {
        return (
          <Row type="flex" style={{flexDirection: 'column'}}>
            {
              childs.map((r, index, arr) => {
                const _positionClass = {
                  first: (index === 0 ),
                  laster: (index === (arr.length - 1)),
                  haschildren: (r.children && r.children.length > 0),
                  multle: arr.length > 1,
                }
                const _classnames = {
                  ...classnames,
                  ..._positionClass,
                  do: (r.status === 'do'),
                  undo: (r.status === 'undo'),
                  doing: (r.status === 'doing')
                }
               
                return (
                  <>
                    {
                      (!r.children || r.children.length === 0) ? (<Col key={r.key} class={_classnames}>{ r.label}<span class="temp-line"></span><span class="before-temp-line"></span></Col>) : null
                    }
                    {
                      (r.children && r.children.length > 0) ? (
                        <Col>
                        <Row type="flex" align="middle"  style={{flexDirection: 'row'}}>
                          <Col key={r.key} class={{...classnames, ..._positionClass}}>{ r.label}<span class="temp-line"></span><span class="before-temp-line"></span></Col>
                          <Col class={{'tree-steps-children': true}}>
                              {this.renderItems(r.children, false)}
                           </Col>
                        </Row>
                        </Col>
                      ) : null
                    }    
                  </>
                )
              })
            }
          </Row>
        )
      }
    },

    // 渲染阶段分组
    renderWaper(){
      const lastIndex = this.datas.length - 1
      return this.datalist.map((r, index, arr) => {
        console.log(r.desc);
        const classnames = {
          'tree-steps-group': r.group,
          'tree-steps-firstitem': (index===0 && arr.length > 1),
          'tree-steps-lastitem': (index===lastIndex && arr.length > 1),
          'no-border': (!r.children || (r.children.length === 1 && (!r.children[0].children || r.children[0].children.length === 0)))
        }
        return (
          <Col class={classnames}>
            {
              this.renderItems(r.children, true, r)
            }
          </Col>
        )
      })
    }
  },
  mounted(){
    this.updateLayout()
  },
  render(){

    const rowProps = {
       type:"flex", 
       align: "middle",
       justify:"center"
    }

    return (
      <Row {...rowProps} class="tree-steps" ref="cref">
        {
          this.renderWaper()
        }
      </Row>
    )
  }
}

export default defineComponent(Comp)