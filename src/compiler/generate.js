
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g  // 匹配插值语法

function geneProps(attrs) {
  let props = ``
  attrs.forEach(attr => {
    if(attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach(styleItem => {
        let [key,value] = styleItem.split(':')
        obj[key] = `${value}`
      })
      attr.value = obj
    }
    props += `${attr.name}:${JSON.stringify(attr.value)},`
  })
  return `{${props.slice(0,-1)}}`
}

function gen(node) {
  if(node.type == 1){
    return generate(node)
  }else {
    let text = node.text
    let tokens = [];
    let match;
    let lastIndex = defaultTagRE.lastIndex = 0
    while(match = defaultTagRE.exec(text)){
      let index = match.index //开始索引
      if(index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex,index))) // 截取普通字符串
      }
      tokens.push(match[1].trim()) // 截取插值语法字符串
      lastIndex = index + match[0].length
    }
    if(lastIndex<text.length) {
      tokens.push(text.slice(lastIndex))
    }
    return `_v(${tokens.join('+')})`
  }
}

function geneChildren(root) {
  let children = root.children
  if(children && children.length > 0) {
    return children.map(c => gen(c)).join(',') 
  }else{
    return false
  }
}

export function generate(root) {
let children = geneChildren(root)
  let code = `_c('${root.tag}',${root.attrs.length > 0 ? geneProps(root.attrs) : undefined}${children ? `,${children}` : ''})`
  console.log(code);
  return code
}