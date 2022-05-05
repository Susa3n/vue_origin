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
    this.cb = cb // 保存回调函数
    this.options = options
    this.user = options.user // 用户watch
    this.lazy = !!options.lazy // 计算属性watch 初次不加载
    this.dirty = options.lazy // 计算属性watch 默认是脏的 
    if (typeof exprOrFn == 'string') { // 如果是用户watch exprOrFn是一个表达式 'name' 'person.nam'
      this.getter = function () {  // getter为一个函数，通过表达式的取值 将watcher 和 表达式的dep进行关联
        let obj = vm
        exprOrFn.split('.').forEach(i => {
          obj = obj[i]
        })
        return obj
      }
    } else {
      this.getter = exprOrFn // 挂载到实例的getter属性上，当被观测的数据发生变化 执行this.get
    }
    this.id = id++
    this.deps = []
    this.depIds = new Set()
    this.value = this.lazy ? undefined : this.get() // 默认第一次执行 拿到watcher的值 保存到实例上，以便用户watcher发生变化执行callback传入对应新值和旧值
  }

  get() { // 利用JS的单线程
    pushTarget(this) // 开始：将watcher（页面）和dep（数据） 进行关联起来
    let value = this.getter.call(this.vm) // 读取对应数据 
    popTarget()
    return value
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
    if(this.lazy) { // 如果当前watcher是计算属性watcher dirty为true是脏的
      this.dirty = true
    }else {
      queueWatcher(this)
    }
  }

  run() {
    let oldValue = this.value // 当监听的值发生变化保存旧值在当前作用域
    let newValue = this.value = this.get() // 保存新值到实例上 用于下次更新
    if (this.user) {
      this.cb.call(this.vm, newValue, oldValue) // 如果是用户watcher 执行回调函数 传入参数
    }
  }
  evaluate() {
      this.value = this.get() // 调用计算属性的getter函数
      this.dirty = false // 脏值变为不脏的  
      return this.value // 返回计算属性的值
  }

  depend() {
    let i = this.deps.length // 拿去当前计算属性上的dep，拿到每个dep关联渲染watcher
    while(i--) {
      this.deps[i].append()
    }
  }

}

// watcher 和 dep
// 我们将更新界面的功能封装了一个渲染watcher
// 渲染页面前，会将watcher放到Dep的类上  Dep.target = watcher
// 在vue中页面渲染时使用属性，需要进行依赖收集，收集对象的渲染watcher
  // 取值时给每个属性都加了一个dep实例，用于存储渲染watcher（同一个watcher可能存有多个dep）
  // 每个属性可能对应多个视图（多个视图就对应多个watcher） 一个属性对应多个watcher
// dep.depend() => 通知dep存放watcher  Dep.target.addDep () => 通知watcher存放dep