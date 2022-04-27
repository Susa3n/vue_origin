import { createTextNode,createElementNode } from "./vdom/create-vdom"

export function renderMixin(Vue){
  Vue.prototype._c = function() {
    return createElementNode(...arguments)
  }

  Vue.prototype._v = function(text) {
    return createTextNode(text)
  }

  Vue.prototype._s = function(val) {
    return val === null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val);
  }

  Vue.prototype._render = function() {
    let render = this.$options.render
    return render.call(this)
  }
}