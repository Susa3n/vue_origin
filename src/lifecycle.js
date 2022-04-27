

import { patch } from "./vdom/patch";
export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
      let vm = this
      patch(vm.$el,vnode); // 需要用虚拟节点创建出真实节点 替换掉 真实的$el
     
      // 我要通过虚拟节点 渲染出真实的dom
    
  }
}


export function mountComponent(vm,el) {
  const options = vm.$options
  console.log(el);
  vm.$el = el
  let updateComponent = () => {
    vm._update(vm._render())
  }
  updateComponent()

}