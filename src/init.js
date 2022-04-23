import { initState } from "./state"
export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this // 缓存this 保存到当前作用域
    vm.$options = options  // 将选项保存到实例的$options

    // 对数据进行初始化 比如 data  computed watch ...
    initState(vm)
  }
}
