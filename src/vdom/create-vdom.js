export function createElementNode(tagName,data = {},...children) {
  let key = data.key
  if(key) {
    delete data.key
  }
  return vnode(tagName,data,key,children,undefined)
}

export function createTextNode(text) {
  return vnode(undefined,undefined,undefined,undefined,text)
}

function vnode(tagName, data, key, children, text) {
  return {
    tagName, data, key, children, text
  }
}