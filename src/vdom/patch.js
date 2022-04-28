
export function patch(oldElm, vnode) {
  const isRealDom = oldElm.nodeType
  if (isRealDom) {
    let el =  createElm(vnode) // 根据虚拟节点创建真实节点
    let parentElm = oldElm.parentNode // 拿去旧节点的父节点 body
    parentElm.insertBefore(el,oldElm.nextSibling) // 在旧节点的下一个节点钱插入编译好的真实节点
    parentElm.removeChild(oldElm);  // 移除旧的节点 进行模板替换
    return el  // 将渲染好的真实节点返回
  }
}

function createElm(vnode) {
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
    return document.createTextNode(text) // 返回文本节点
  }
  return vnode.el // 返回当前编译好的当前元素节点 用于添加子节点 最后将编译好的根节点返回
}

function updateProps(vnode) { // 更新当前节点的属性
  const el = vnode.el // 拿去当前真实节点
  const attrs = vnode.data // 拿去当前节点的属性
  for (const key in attrs) { // 遍历属性
    if (Object.hasOwnProperty.call(attrs, key)) {
      if (key === 'style') { // 如果当前属性key为style
        // const attr = attrs[key]
        // let str = ``
        // Object.entries(attr).forEach(item => {
        //   let [name, value] = item
        //   str += `${name}:${value}; `
        // })
        // el.setAttribute('style', `${str.slice(0, str.length - 1)}`)
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