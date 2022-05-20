
export function patch(oldElm, vnode) {
  const isRealDom = oldElm && oldElm.nodeType
  if (isRealDom) {
    let el = createElm(vnode) // 根据虚拟节点创建真实节点
    let parentElm = oldElm.parentNode // 拿去旧节点的父节点 body
    parentElm.insertBefore(el, oldElm.nextSibling) // 在旧节点的下一个节点钱插入编译好的真实节点
    parentElm.removeChild(oldElm);  // 移除旧的节点 进行模板替换
    return el  // 将渲染好的真实节点返回
  } else {
    if (oldElm.tagName !== vnode.tagName) { // 如果根节点名称不同，根据新的虚拟节点创建真实dom替换旧的真实dom
      document.body.replaceChild(createElm(vnode), oldElm.el)
    }

    if (!oldElm.tagName) { // 如果旧节点没有节点名称，代表为文本节点 判断新旧节点文本内容是否相同 如果不同进行替换
      if (oldElm.text !== vnode.text) {
        oldElm.el.textContent = vnode.text
      }
    }
    // 新虚拟节点的el属性指向旧节点的真实dom
    let el = vnode.el = oldElm.el
    // 如果节点名称相同 更新节点属性
    updateProps(vnode, oldElm.data) // 更新完属性后 进行对对比子节点

    let oldChildren = oldElm.children || []// 旧虚拟节点的孩子属性
    let newChildren = vnode.children || []// 新虚拟节点的孩子属性
    if (oldChildren.length > 0 && newChildren.length > 0) { // 如果 新旧孩子节点都大于0  对比孩子节点
      patchChildren(el, oldChildren, newChildren)
    } else if (oldChildren.length > 0) { // 如果旧孩子节点大于0 新节点为空，对el真实dom 移除子节点
      oldChildren.forEach(i => {
        el.removeChild(i.el)
      })
    } else if (newChildren.length > 0) { // 如果新孩子节点大于0 旧节点为空，对el真实dom 添加子节点
      newChildren.forEach(i => {
        el.appendChild(createElm(i))
      })
    }
    return el
  }
}
function isSameTag(oldVnode, newVnode) {
  return oldVnode.tagName == newVnode.tagName && oldVnode.key == newVnode.key
}

function makeChildrenMap(children) {
  let map = {}
  children.forEach((item, index) => {
    map[item.key] = index
  })
  return map
}

function patchChildren(parent, oldChildren, newChildren) {
  let oldStartIndex = 0
  let oldStartVnode = oldChildren[0]
  let oldEndIndex = oldChildren.length - 1
  let oldEndVnode = oldChildren[oldEndIndex]

  let newStartIndex = 0
  let newStartVnode = newChildren[0]
  let newEndIndex = newChildren.length - 1
  let newEndVnode = newChildren[newEndIndex]

  let map = makeChildrenMap(oldChildren)

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (oldStartVnode == null) {
      oldStartVnode = oldChildren[++oldStartIndex]
    } else if (oldEndIndex == null) {
      oldEndVnode = oldChildren[--oldEndIndex]
    } else if (isSameTag(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameTag(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameTag(oldEndVnode, newStartVnode)) {
      patch(oldEndVnode, newStartVnode)
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameTag(oldStartVnode, newEndVnode)) {
      patch(oldStartVnode, newEndVnode)
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else {
      let moveIndex = map[newStartVnode.key]
      if (moveIndex) {
        let moveVnode = oldChildren[moveIndex]
        parent.insertBefore(moveVnode.el, oldStartVnode.el)
        oldChildren[moveIndex] = null
        patch(moveVnode, newStartVnode)
      } else {
        parent.insertBefore(createElm(newStartVnode), oldStartVnode.el)
      }
      newStartVnode = newChildren[++newStartIndex]
    }

  }

  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      let nextEndVnode = newChildren[newEndIndex + 1]
      let nextNode = nextEndVnode ? newChildren[newEndIndex + 1].el : null
      parent.insertBefore(createElm(newChildren[i]), nextNode)
    }
  }

  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      parent.removeChild(oldChildren[i].el)
    }
  }


}

export function createElm(vnode) {
  const { tagName, data, key, children, text } = vnode
  if (tagName) { // 如果是元素节点
    vnode.el = document.createElement(tagName) // 创建元素节点
    updateProps(vnode) // 更新当前节点的属性
    if (children && children.length > 0) { // 判断当前节点是否有子节点
      children.forEach(child => { // 遍历子节点
        return vnode.el.appendChild(createElm(child)) //将子节点添加到父节点上
      })
    }
  } else { // 如果是文本节点
    vnode.el = document.createTextNode(text) // 返回文本节点
  }
  return vnode.el // 返回当前编译好的当前元素节点 用于添加子节点 最后将编译好的根节点返回
}

function updateProps(vnode, data = {}) { // 更新当前节点的属性
  const el = vnode.el // 拿取旧节点的真实节点 新旧虚拟节点el属性都指向当前el
  const attrs = vnode.data || {} // 获取新虚拟节点的的属性
  const oldAttrs = data // 获取旧节点的属性

  const style = attrs.style || {} // 获取新虚拟节点的style属性 默认为空
  const oldStyle = oldAttrs.style || {} // 获取旧虚拟节点的style属性 默认为空
  for (const key in oldStyle) { // 遍历旧虚拟节点的style属性key 判断key是否存在新虚拟节点的style属性中
    if (!style[key]) { // 如果不在 直接通过 el真实dom赋值当前style属性的key为空
      el.style[key] = ""
    }
  }

  for (const key in oldAttrs) { // 同理 获取旧节点的属性 进行遍历 判断新节点是否有该属性
    if (!attrs[key]) { // 如果没有 el真实dom 移除改属性
      el.removeAttribute(key)
    }
  }
  for (const key in attrs) { // 遍历新节点的属性 依次对真实节点的样式、class、及其他属性进行赋值
    if (Object.hasOwnProperty.call(attrs, key)) {
      if (key === 'style') { // 如果当前属性key为style
        for (const key in attrs.style) { // 遍历style对象
          el.style[key] = attrs.style[key] // 给当前真实节点添加样式
        }
      } else if (key === 'class') { // 如果当前key是class 给当前真实节点添加class
        el.className = attrs.class
      } else {
        el.setAttribute(key, attrs[key]) // 设置其他属性比如 a:1 <div a="1">
      }
    }
  }
}


// 首先 判断 旧的虚拟节点是否为元素节点 nodeType
// 如果是元素节点代表是真实的dom 需要进行渲染操作
// 递归遍历虚拟节点 创建真实节点 在这一过程中将虚拟节点的data属性 挂载到生成真实dom节点的属性上