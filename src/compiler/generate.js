
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g  // 匹配插值语法

function geneProps(attrs) {
  let props = `` 
  attrs.forEach(attr => { // 遍历当前节点的属性list  {id:'app',class:'classA',style: {font-size: '14px',color:'red'}}
    if(attr.name === 'style') { // 如果当前属性item的name为style {font-size: '14px';color:'red'}
      let obj = {} // 定义空对象
      // console.log(attr.value);
      attr.value.split(';').forEach(styleItem => {   // 拿到当前value进行split  [font-size: '14px',color:'red']
        let [key,value] = styleItem.split(':') // [key: 'font-size',value: '14px']  [key: 'color',value: 'red']
        obj[key] = `${value}` // obj = {font-size: '14px',color: 'red'}
      })
      attr.value = obj // attr.style = {font-size: '14px',color: 'red'}
    }
    props += `${attr.name}:${JSON.stringify(attr.value)},` // 如果name不是style,直接拼:props = id:'app',class:'classA',style:{font-size: '14px';color:'red'}
  })
  return `{${props.slice(0,-1)}}` // return {id:'app',class:'classA',style:{font-size: '14px';color:'red'}}
}

function gen(node) {
  if(node.type == 1){ // 如果当前节点为为标签节点  递归调用generate方法
    return generate(node)
  }else { // 如果是文本节点
    let text = node.text // 获取文本内容
    let tokens = []; // 定义空数组 方便依次递加
    let match;
    let lastIndex = defaultTagRE.lastIndex = 0 // defaultTagRE插值语法{{}} 匹配每次用exec匹配时候默认最后一次匹配项为0
    while(match = defaultTagRE.exec(text)){ // while循环去匹配当前text = "hello  {{name}}  word"
      let index = match.index //开始索引 第一次匹配到的index  hello  的长度
      if(index > lastIndex) { // 将hello  push到tokens中
        tokens.push(JSON.stringify(text.slice(lastIndex,index))) // 截取普通字符串
      }
      tokens.push(`_s(${match[1].trim()})`) // 截取插值语法字符串push到tokens中
      lastIndex = index + match[0].length // 将当前lastIndex = hello  {{name}}的长度 循环匹配直至最后一次 
    }
    if(lastIndex<text.length) { // 将最后的  word push到tokens中
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    return `_v(${tokens.join('+')})` // 转为字符串return
  }
}

function geneChildren(root) { 
  let children = root.children // 拿到当前children 判断children是否大于0 继续转化子节点 
  if(children && children.length > 0) {
    return children.map(c => gen(c)).join(',') 
  }else{
    return false
  }
}

export function generate(root) { // 传入ast语法树
let children = geneChildren(root) // 转化当前传入的root.children
  //  geneProps(root.attrs) 转化 当前节点的属性
  let code = `_c('${root.tag}',${root.attrs.length > 0 ? geneProps(root.attrs) : undefined}${children ? `,${children}` : ''})`
  return code
}