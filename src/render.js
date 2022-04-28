import { createTextNode, createElementNode } from "./vdom/create-vdom"

//  Vue原型混入 _c _v  _s 方法执行render函数时会用到。

export function renderMixin(Vue) {
  Vue.prototype._c = function () { // 编译元素节点
    return createElementNode(...arguments)
  }

  Vue.prototype._v = function (text) {  // 编译文本节点
    return createTextNode(text)
  }

  Vue.prototype._s = function (val) { // 编译插值语法 
    return val === null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val); // 如果取到当前值是对象 需要stringify转化
  }

  Vue.prototype._render = function () {
    let render = this.$options.render // 拿到配置对象中的render方法 
    return render.call(this) // 调用 render方法 this指向当前实例  返回执行render函数后 产生的一个对象
  }
}

//  _c('div',{id:"app",class:"warp",style:{"font-size":" 16px","color":"red"}},_c('span',undefined,_v("hello"+_s(name)+"word")),_c('ul',undefined,_c('li',undefined,_v(_s(person.name))),_c('li',undefined,_v(_s(person.age)))))}