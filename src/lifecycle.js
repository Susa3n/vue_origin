

import { patch } from "./vdom/patch";
export function lifecycleMixin(Vue) {  
  Vue.prototype._update = function (vnode) { // 混入_update更新界面的方法 接收参数（执行render函数后生成的对象）
      let vm = this
      vm.$el =  patch(vm.$el,vnode); // 需要用虚拟节点创建出真实节点 替换掉 真实的$el
      // 我要通过虚拟节点 渲染出真实的dom

      
  }
}


export function mountComponent(vm,el) {
  const options = vm.$options
  vm.$el = el
  let updateComponent = () => {
    vm._update(vm._render())
  }
  updateComponent()
}