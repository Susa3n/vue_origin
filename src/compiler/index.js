
import { parserHtml } from "./parseHtml"
import { generate } from "./generate";
export function compileToFunction(template) {
  let root = parserHtml(template) // 编译模板字符串 转为 ast语法
  let code = generate(root)
   
  // console.log(code);
}

