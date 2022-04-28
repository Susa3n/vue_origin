export function createElementNode(tagName,data = {},...children) { // 编译节点 最终返回一个对象
  let key = data.key
  if(key) {
    delete data.key
  }
  return vnode(tagName,data,key,children,undefined)
}

export function createTextNode(text) { // 翻译文本内容
  return vnode(undefined,undefined,undefined,undefined,text)
}

function vnode(tagName, data, key, children, text) { // 节点名称  节点属性 节点key 子节点  文本内容
  return {
    tagName, data, key, children, text
  }
}