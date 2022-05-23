
export function patch(oldElm, vnode) {
  const isRealDom = oldElm && oldElm.nodeType
  if (isRealDom) {
    let el = createElm(vnode) // 根据虚拟节点创建真实节点
    let parentElm = oldElm.parentNode // 拿去旧节点的父节点 body
    parentElm.insertBefore(el, oldElm.nextSibling) // 在旧节点的下一个节点钱插入编译好的真实节点
    parentElm.removeChild(oldElm);  // 移除旧的节点 进行模板替换
    return el  // 将渲染好的真实节点返回
  } else { // 对比虚拟节点 替换真实节点
    if (oldElm.tagName !== vnode.tagName) { // 如果节点的名称不同 找到父节点进行替换
      oldElm.el.parentNode.replaceChild(createElm(vnode), oldElm.el)
    }

    if (!oldElm.tagName) { // 如果是文本节点 当前oldElm.tagName为undefined
      if (oldElm.text !== vnode.text) { // 对比文本内容 如果不同进行赋值
        oldElm.el.textContent = vnode.text
      }
    }

    let el = vnode.el = oldElm.el // 将真实dom赋值给新虚拟节点的el属性
    // 对比属性  传入新虚拟节点 和 旧节点的属性
    updateProps(vnode, oldElm.data)

    // 对比孩子属性
    let newChildren = vnode.children || []
    let oldChildren = oldElm.children || []
    if (newChildren.length > 0 && oldChildren.length > 0) { // 如果children的长度都大于0
      patchChildren(el, newChildren, oldChildren) // 对比孩子节点 传入 （父节点,新虚拟节点list,旧虚拟节点list）
    } else if (newChildren.length > 0) { // 如果新虚拟节点length大于0 旧虚拟节点length = 0
      newChildren.forEach(i => { // 遍历新虚拟节点 依次添加父节点的子节点
        el.appendChild(createElm(i))
      })
    } else if (oldChildren.length > 0) { // 如果旧虚拟节点length大于0 新虚拟节点length = 0
      oldChildren.forEach(i => { // // 遍历新虚拟节点 依次从父节点移除子节点
        el.removeChild(i.el)
      })
    }
    return el
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

function isSameTag(newChild, oldChild) {
  return newChild.tagName ===oldChild.tagName && newChild.key == oldChild.key
}

function updateProps(vnode, oldVnodeData = {}) { // 更新当前节点的属性
  const el = vnode.el // 拿去当前真实dom
  const newData = vnode.data || {} // 拿去当前节点的属性
  const oldData = oldVnodeData // 拿去旧节点的属性 默认为空对象

  const newStyle = newData.style || {} // 拿去当前虚拟节点样式属性
  const oldStyle = oldVnodeData.style || {}  // 拿去旧虚拟节点样式属性

  for (const key in oldStyle) { // 遍历旧样式属性
    if (!newStyle[key]) { // 如果新样式属性中没有当前key
      el.style[key] = "" // 真实dom的style属性的key置为空
    }
  }

  for (const key in oldData) { // 同理遍历旧虚拟节点的属性
    if (!newData[key]) { // 如果新虚拟节点的属性没有当前key
      el.removeAttribute(key) // 真实dom移除当前属性
    }
  }


  for (const key in newData) { // 遍历属性
    if (Object.hasOwnProperty.call(newData, key)) {
      if (key === 'style') { // 如果当前属性key为style
        for (const key in newData.style) { // 遍历style对象
          el.style[key] = newData.style[key] // 给当前真实节点添加样式
        }
      } else if (key === 'class') { // 如果当前key是class 给当前真实节点添加class
        el.className = newData.class
      } else {
        el.setAttribute(key, newData[key]) // 设置其他属性比如 a:1 <div a="1">
      }
    }
  }
}

function makeChildrenMap(children) {
  let map = {}
  children.forEach((item,index) => {
    if(item.key) {
      map[item.key] = index
    } 
  })
  return map
}

// 双指针对比孩子虚拟节点
function patchChildren(parent, newChildren, oldChildren) { 
  let newStartIndex = 0 
  let newStartVnode = newChildren[0]
  let newEndIndex = newChildren.length - 1
  let newEndVnode = newChildren[newEndIndex]


  let oldStartIndex = 0
  let oldStartVnode = oldChildren[0]
  let oldEndIndex = oldChildren.length - 1
  let oldEndVnode = oldChildren[oldEndIndex]
  // 收集旧虚拟节点的子节点 存在map中{key:index}
    let map = makeChildrenMap(oldChildren)
    while (newStartIndex <= newEndIndex && oldStartIndex <= oldEndIndex) {
    if(oldStartVnode == null) { //因为暴力对比,匹配到的节点为置为null  所以当遇到节点为null的向下递加向上递减
      oldStartVnode = oldChildren[++oldStartIndex]
    }else if(oldEndVnode == null){
      oldEndVnode = oldChildren[--oldEndIndex]
      // 如果新虚拟节点的开头 和 旧虚拟节点的开头 相同
    }else if(isSameTag(newStartVnode,oldStartVnode)) {
      patch(oldStartVnode,newStartVnode) // 对比子节点 
      newStartVnode = newChildren[++newStartIndex]
      oldStartVnode = oldChildren[++oldStartIndex]
      // 如果新虚拟节点的结尾 和 旧虚拟节点的结尾 相同
    }else if(isSameTag(newEndVnode,oldEndVnode)) {
      patch(oldEndVnode,newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
      // 如果新虚拟节点的结尾 和 旧虚拟节点的开始 相同
    }else if(isSameTag(newEndVnode,oldStartVnode)) {
      patch(oldStartVnode,newEndVnode)
      parent.insertBefore(oldStartVnode.el,oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
      // 如果新虚拟节点的开始 和 旧虚拟节点的结尾 相同
    }else if(isSameTag(newStartVnode,oldEndVnode)) {
      patch(oldEndVnode,newStartVnode)
      parent.insertBefore(oldEndVnode.el,oldStartVnode.el)
      newStartVnode = newChildren[++newStartIndex]
      oldEndVnode = oldChildren[--oldEndIndex]
    }else {
      // 暴力对比  
      // 未进入while之前 已经存了map对象 {key:index}
      // 如果之前的条件都未成立 通过新虚拟节点的key 去map中查找 到index 
      let moveIndex = map[newStartVnode.key]
      if(!moveIndex) { // 如果没查找到 将虚拟节点转为真实dom 添加到父节点中
        parent.insertBefore(createElm(newStartVnode),oldStartVnode.el)
      }else { // 通过index 可以拿到旧虚拟节点
        let moveVnode = oldChildren[moveIndex]
        patch(moveVnode,newStartVnode) // 对比节点
        oldChildren[moveIndex] = null // 将旧节点置为null 进行占位
        parent.insertBefore(moveVnode.el,oldStartVnode.el) // 添加真实dom
      }
      newStartVnode = newChildren[++newStartIndex]
    }
  }

  // 当跳出while循环
    // 新的子节点开始大于结尾  
    // 遍历开始和结尾的长度 通过newChildren拿到虚拟dom 从父节点中添加
  if(newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // newChildren[newEndIndex+1] 代表从开始加或者从结尾加
      let el = newChildren[newEndIndex+1] == null  ? null : newChildren[newEndIndex+1].el
      parent.insertBefore(createElm(newChildren[i]),el)     
    }
  }
  // 旧的子节点开始大于结尾
  // 遍历开始和结尾的长度 父节点中移除子节点
  if(oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      if(!oldChildren[i]) {
        parent.removeChild(oldChildren[i].el)
      }
    }
  }



}


// 首先 判断 旧的虚拟节点是否为元素节点 nodeType
// 如果是元素节点代表是真实的dom 需要进行渲染操作
// 递归遍历虚拟节点 创建真实节点 在这一过程中将虚拟节点的data属性 挂载到生成真实dom节点的属性上