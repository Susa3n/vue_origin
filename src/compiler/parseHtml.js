
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // abc-aaa
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // <aaa:asdads>
//  /^<((?:[a-zA-Z_][\-\.0-9_a-zA-Z]*\:)?[a-zA-Z_][\-\.0-9_a-zA-Z]*)/
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名 
// /^<\/((?:[a-zA-Z_][\-\.0-9_a-zA-Z]*\:)?[a-zA-Z_][\-\.0-9_a-zA-Z]*)[^>]*>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >  <div>


let root = null;
let currParent;
let stack = [];
const ELEMENT_TYPE = 1 // 标签节点  
const TEXT_TYPE = 3 // 文本节点

// 将html字符串通过正则的形式解析出ast
export function parserHtml(html) { // <div id="app"></app>
  while (html) { // 循环解析
    let textEnd = html.indexOf('<') // 查看是否以<开头
    if (textEnd == 0) {
      const startTagMatch = parseStartTag() // 解析开始标签
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }

      const endTagMatch = parseEndTag(html)
      if (endTagMatch) {
        end(endTagMatch[1])
        continue
      }

    }
    let text
    if (textEnd > 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      chars(text)
      advance(text.length)
    }

  }

  function parseStartTag() {
    let start = html.match(startTagOpen) // 将模板字符串匹配开始标签
    if (start) { // 匹配到 创建match对象保存当前 开始标签名 默认属性为空
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length) // 截取已经匹配到的开始标签
      let end, attr
      // 循环匹配 不结束标签 和 属性 当两者同时成立时 拿去匹配到的属性名和属性值 push到 match中 
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
        advance(attr[0].length) // 截取已经匹配到的属性
      }
      if (end) { // 当匹配到结束标签时
        advance(end[0].length)
        return match
      }
    }
  }

  function parseEndTag() {
    let endTagMatch = html.match(endTag) // 将模板字符串匹配开始标签
    advance(endTagMatch[0].length)
    return endTagMatch
  }

  function advance(len) {
    html = html.substring(len)
  }

  return root
}


function createElement(tagName, attrs) {
  return {
    type: ELEMENT_TYPE,
    tag: tagName,
    children: [],
    attrs,
    parent: null
  }
}

function start(tagName, tagAttrs) {
  let element = createElement(tagName, tagAttrs)
  if (!root) {
    root = element
  }
  stack.push(element)
  currParent = element
}
function end(tagName) {
  let currentElement = stack.pop()
  let parentElement = stack[stack.length - 1]
  if (tagName == currentElement.tag) {
    if (parentElement) {
      parentElement.children.push(currentElement)
      currentElement.parent = parentElement
    }
  }
}
function chars(text) {
  text = text.replace(/\s/g, '')
  if (text) {
    currParent.children.push({
      type: TEXT_TYPE,
      text
    })
  }
}

