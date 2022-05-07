import { mergeOptions } from "../utils"


export function globalApi(Vue) {
  Vue.options = {} // Vue本身有options属性是空对象
  Vue.mixin = function (options) {  // mixin混入，在这个方法里合并配置对象
    this.options = mergeOptions(this.options,options) // 将用户传的options和本身的options进行合并
    return this
  }
}