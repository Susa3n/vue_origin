import { initState } from "./state"
import { compileToFunction } from "./compiler/index"

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this // 缓存this 保存到当前作用域
    vm.$options = options  // 将选项保存到实例的$options

    // 对数据进行初始化 比如 data  computed watch ...
    initState(vm)

    if(vm.$options.el){
      vm.$mount(vm.$options.el) // 挂载界面，如果当前配置项有el属性，传入当前el
    }
  }
  Vue.prototype.$mount = function(el) {
    const vm = this
    let options = vm.$options
    el = document.querySelector(el)
    if(!options.render) { // render配置项高于el
      let template = options.template
      if(!template && el) { // 判断配置项是否有template属性  如果没有就拿el的outerHTML
        template = el.outerHTML // 模板字符串  之后通过正则进行匹配 将模板字符串转为render渲染函数
        let render = compileToFunction(template)
        options.render = render // 挂载到配置项中，以后数据发生变化 可以通过配置项直接执行渲染函数
      }
    } 
  }

}
