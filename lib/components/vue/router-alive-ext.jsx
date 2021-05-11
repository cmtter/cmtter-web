import  {  
  KeepAlive,
  getCurrentInstance,
  watch,
  onMounted,
  onUpdated,
  onBeforeUnmount,
  isVNode,
  cloneVNode,
  setTransitionHooks
} from 'vue'

import  {  
  isString,
  isArray,
  invokeArrayFns
} from '@vue/shared'

import  {
  callWithAsyncErrorHandling,
  queuePostFlushCb
} from '@vue/runtime-core'

const MoveType = {
  ENTER: 0,
  LEAVE: 1,
  REORDER: 2
}

export function queueEffectWithSuspense(
  fn,
  suspense
) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn)
    } else {
      suspense.effects.push(fn)
    }
  } else {
    queuePostFlushCb(fn)
  }
}

const queuePostRenderEffect = queueEffectWithSuspense
const ShapeFlags = {
    ELEMENT: 1,
    FUNCTIONAL_COMPONENT: 2,
    STATEFUL_COMPONENT : 4,
    TEXT_CHILDREN: 8,
    ARRAY_CHILDREN: 16,
    SLOTS_CHILDREN: 32,
    TELEPORT: 64,
    SUSPENSE: 128,
    COMPONENT_SHOULD_KEEP_ALIVE: 256,
    COMPONENT_KEPT_ALIVE: 512,
    COMPONENT: 6
}

/**
 * 扩展 vue keep-alive 
 */
export default {
  ...KeepAlive,
  setup(props, { slots }) {
    const cache = new Map()
    const keys = new Set()
    let current = null

    const instance = getCurrentInstance()
    const parentSuspense = instance.suspense

    const sharedContext = instance.ctx

    const {
      renderer: {
        p: patch,
        m: move,
        um: _unmount,
        o: { createElement }
      }
    } = sharedContext
    const storageContainer = createElement('div')

    sharedContext.activate = (vnode, container, anchor, isSVG, optimized) => {
      const instance = vnode.component
      move(vnode, container, anchor, MoveType.ENTER, parentSuspense)
      // in case props have changed
      patch(
        instance.vnode,
        vnode,
        container,
        anchor,
        instance,
        parentSuspense,
        isSVG,
        optimized
      )
      queuePostRenderEffect(() => {
        instance.isDeactivated = false
        if (instance.a) {
          invokeArrayFns(instance.a)
        }
        const vnodeHook = vnode.props && vnode.props.onVnodeMounted
        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance.parent, vnode)
        }
      }, parentSuspense)
    }

    sharedContext.deactivate = (vnode) => {
      const instance = vnode.component
      move(vnode, storageContainer, null, MoveType.LEAVE, parentSuspense)
      queuePostRenderEffect(() => {
        if (instance.da) {
          invokeArrayFns(instance.da)
        }
        const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted
        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance.parent, vnode)
        }
        instance.isDeactivated = true
      }, parentSuspense)
    }

    function unmount(vnode) {
      // reset the shapeFlag so it can be properly unmounted
      resetShapeFlag(vnode)
      _unmount(vnode, instance, parentSuspense)
    }

    function pruneCache(filter) {
      cache.forEach((vnode, key) => { 
        const name = getComponentName(vnode.type, vnode.key)
        if (name && (!filter || !filter(name))) {
          pruneCacheEntry(key)
        }
      })
    }

    function pruneCacheEntry(key) {
      const cached = cache.get(key)
      // if (!current || cached.type !== current.type) {
      //   unmount(cached)
      // } else if (current) {
      //   resetShapeFlag(current)
      // }
      // 当tab区域存在模块页面
      if (current){
        unmount(cached)
      }
      
      cache.delete(key)
      keys.delete(key)
    }

    watch(
      () => [props.include, props.exclude],
      ([include, exclude]) => {
        include && pruneCache(name => matches(include, name))
        exclude && pruneCache(name => !matches(exclude, name))
      },
      // prune post-render after `current` has been updated
      { flush: 'post', deep: true }
    )

    // cache sub tree after render
    let pendingCacheKey = null
    const cacheSubtree = () => {
      // fix #1621, the pendingCacheKey could be 0
      if (pendingCacheKey != null) {
        cache.set(pendingCacheKey, getInnerChild(instance.subTree))
      }
    }
    onMounted(cacheSubtree)
    onUpdated(cacheSubtree)

    onBeforeUnmount(() => {
      cache.forEach(cached => {
        const { subTree, suspense } = instance
        const vnode = getInnerChild(subTree)
        if (cached.type === vnode.type) {
          // current instance will be unmounted as part of keep-alive's unmount
          resetShapeFlag(vnode)
          // but invoke its deactivated hook here
          const da = vnode.component.da
          da && queuePostRenderEffect(da, suspense)
          return
        }
        unmount(cached)
      })
    })

    //render fn

    return () => {
      pendingCacheKey = null

      if (!slots.default) {
        return null
      }

      const children = slots.default()
      const rawVNode = children[0]
      if (children.length > 1) {
       current = null
        return children
      } else if (
        !isVNode(rawVNode) ||
        (!(rawVNode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) &&
          !(rawVNode.shapeFlag & ShapeFlags.SUSPENSE))
      ) {
        current = null
        return rawVNode
      }

      let vnode = getInnerChild(rawVNode)
      const comp = vnode.type

      const name = getComponentName(comp, vnode.key)
      const { include, exclude, max } = props

      if (
        (include && (!name || !matches(include, name))) ||
        (exclude && name && matches(exclude, name))
      ) {
        current = vnode
        return rawVNode
      }

      const key = vnode.key == null ? comp : vnode.key
      const cachedVNode = cache.get(key)

      if (vnode.el) {
        vnode = cloneVNode(vnode)
        if (rawVNode.shapeFlag & ShapeFlags.SUSPENSE) {
          rawVNode.ssContent = vnode
        }
      }
    
      pendingCacheKey = key

      if (cachedVNode) {
        vnode.el = cachedVNode.el
        vnode.component = cachedVNode.component
        if (vnode.transition) {
          setTransitionHooks(vnode, vnode.transition)
        }
        vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE
        keys.delete(key)
        keys.add(key)
      } else {
        keys.add(key)
        if (max && keys.size > parseInt(max, 10)) {
          pruneCacheEntry(keys.values().next().value)
        }
      }
      vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE

      current = vnode
      return rawVNode
    }
  }
}

function isFunction(val){
  return typeof val === 'function'
}

function getComponentName(
  Component,
  key
){
  if (key){
    return key
  }
  return isFunction(Component)
    ? Component.displayName || Component.name
    : Component.name
}


function resetShapeFlag(vnode) {
  let shapeFlag = vnode.shapeFlag
  if (shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE) {
    shapeFlag -= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
  }
  if (shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
    shapeFlag -= ShapeFlags.COMPONENT_KEPT_ALIVE
  }
  vnode.shapeFlag = shapeFlag
}

function getInnerChild(vnode) {
  return vnode.shapeFlag & ShapeFlags.SUSPENSE ? vnode.ssContent : vnode
}

function matches(pattern, name) {
  if (isArray(pattern)) {
    return pattern.some((p) => matches(p, name))
  } else if (isString(pattern)) {
    return pattern.split(',').indexOf(name) > -1
  } else if (pattern.test) {
    return pattern.test(name)
  }
  return false
}

function invokeVNodeHook(
  hook,
  instance,
  vnode,
  prevVNode = null
) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ])
}