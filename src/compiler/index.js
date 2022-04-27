
import { parserHtml } from "./parseHtml"
import { generate } from "./generate";
export function compileToFunction(template) {
  let root = parserHtml(template) // 编译模板字符串 转为 ast语法
  let code = generate(root)
  let render = new Function(`with(this){ return ${code}}`)
  // console.log(render.call(vm));

  return render
}
// vue2 模板编译的顺序
// template模板 通过正则while匹配 匹配成ast语法（组合成树）
// ast => 递归遍历每个节点  编译成code字符串 _c('div',{id: 'app'},_c(span,undefined,_v('hello'+ _s(name) + 'world')))
// 生成render函数（new Function + with）
// return  render函数 通过.call调用 指定with参数this 



// let obj = {name:'sau3n'}
// with(obj) {
//   console.log(name);
// }