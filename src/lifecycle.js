
import { Watcher } from "./observer/watcher";
import { patch } from "./vdom/patch";
import { nextTick } from './next-tick'
import { callHook } from "./init";
export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) { // 混入_update更新界面的方法 接收参数（执行render函数后生成的对象）
    let vm = this
    const preNode = vm.vnode // vm上取虚拟节点  第一次编译时为undefined
    vm.vnode = vnode // 之后进行赋值
    if(!preNode) { // 没有虚拟节点 用编译后的虚拟节点创建出真实节点 替换掉 真实的$el
      vm.$el = patch(vm.$el, vnode); 
      // 我要通过虚拟节点 渲染出真实的dom
    }else { // 有虚拟节点  前后进行对比替换
      vm.$el = patch(preNode, vnode)
    }
  },

    Vue.prototype.$nextTick = nextTick
}

// 后续可能还会调用此函数 数据刷新更新界面
export function mountComponent(vm, el) {
  const options = vm.$options
  vm.$el = el
  let updateComponent = () => {
    vm._update(vm._render())
  }

  // updateComponent()
  callHook(vm,'beforeMount')
  new Watcher(vm, updateComponent, () => {
    console.log('更新界面');
  }, true)

}

//  在数据劫持的过程中所有的数据绑定对应dep 
// 需要将数据和页面进行关联起来，数据发生变化自动进行更新视图，调用渲染函数 mountComponent
// 创建观察者模式，属性是“被观察者” 渲染函数是“观察者”，当被观察者发生改变，观察者执行对应操作
// Watcher 创建一个类的实例  是观察者
  // 参数1：传入被观测的数据，
  // 参数2：被观察者发生变化后执行观察者的操作
  // 参数3：用户自定义的回调函数，执行完观察者的操作后悔调用回调函数
  // 参数4：配置参数，如果是渲染watcher 配置参数默认为true
