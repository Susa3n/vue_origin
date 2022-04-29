import { pushTarget } from "./dep"
import { popTarget } from "./dep"
let id= 0
export class Watcher {
  /**
   *  Watcher是一个类，生成一个观察者
   * @param {*} vm 被观测的对象或者数据
   * @param {*} exprOrFn  被观测的对象发生变化执行对应操作（渲染watcher是函数，在computed或者watch中是表达式）
   * @param {*} cb 执行完对应操作后的回调函数
   * @param {*} options 配置对象
   */
  constructor(vm,exprOrFn,cb,options) {
    // 将传入的参数保存到实例本身
    this.vm = vm
    this.cb = cb
    this.options = options
    this.getter = exprOrFn // 挂载到实例的getter属性上，当被观测的数据发生变化 执行this.get
    this.id = id++
    this.deps = []
    this.depIds = new Set()
    this.get() // 默认第一次执行
  }

  get() { // 利用JS的单线程
    pushTarget(this) // 开始：将watcher（页面）和dep（数据） 进行关联起来
    this.getter() // 读取对应数据
    popTarget()
  }



  append(dep) { // 接收dep
    if(!this.depIds.has(dep.id)){  // 判断当前watcher中depIds中是否有当前dep
      this.depIds.add(dep.id) // 将接收的dep的id set到当前watcher实例depIds
      this.deps.push(dep) // 将dep保存到watcher的deps中
      dep.addSub(this) // 反之将watcher关联到dep中
    }
  }

  update() { // 当前观察者执行对应操作 
    this.get()
    this.cb()
  }
}