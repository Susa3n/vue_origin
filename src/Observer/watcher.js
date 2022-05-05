import { pushTarget, popTarget } from "./dep"
import { queueWatcher } from './scheduler'
let id = 0
export class Watcher {
  /**
   *  Watcher是一个类，生成一个观察者
   * @param {*} vm 被观测的对象或者数据
   * @param {*} exprOrFn  被观测的对象发生变化执行对应操作（渲染watcher是函数，在computed或者watch中是表达式）
   * @param {*} cb 执行完对应操作后的回调函数
   * @param {*} options 配置对象
   */
  constructor(vm, exprOrFn, cb, options) {
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
    if (!this.depIds.has(dep.id)) {  // 判断当前watcher中depIds中是否有当前dep
      this.depIds.add(dep.id) // 将接收的dep的id set到当前watcher实例depIds
      this.deps.push(dep) // 将dep保存到watcher的deps中
      dep.addSub(this) // 反之将watcher关联到dep中
    }
  }

  update() { // 当前观察者执行对应操作
    // this.get()
    // 如果数据改变通知对应watcher进行update，当多次更改数据时，会导致多次渲染页面，可以将渲染界面改为异步
    // 通过queueWatcher收集watcher，之后进行异步更新
    queueWatcher(this) 
  }

  run() {
    this.get()
  }


}

// watcher 和 dep
// 我们将更新界面的功能封装了一个渲染watcher
// 渲染页面前，会将watcher放到Dep的类上  Dep.target = watcher
// 在vue中页面渲染时使用属性，需要进行依赖收集，收集对象的渲染watcher
  // 取值时给每个属性都加了一个dep实例，用于存储渲染watcher（同一个watcher可能存有多个dep）
  // 每个属性可能对应多个视图（多个视图就对应多个watcher） 一个属性对应多个watcher
// dep.depend() => 通知dep存放watcher  Dep.target.addDep () => 通知watcher存放dep