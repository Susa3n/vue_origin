let id = 0
export class Dep {
  constructor() {
    this.id = id++
    this.sub = []
  }

  append() {
    Dep.target.append(this) // dep添加watcher
  }
  addSub(watcher) { // 反之 watcher添加dep
    this.sub.push(watcher)
  }
  notify() {
    this.sub.forEach(watcher => watcher.update()) // 将当前dep中收集到的watcher进行更新
  }

}
Dep.target = null
let stack = []
// 第一次进来的是渲染watcher  第二次是计算属性watcher 
// 计算属性依赖的数据 收集的只有计算属性watcher，渲染watcher没有收集，比如fullName () {return this.firstName + this.lastName}
// 此时 this.firstName 和 this.lastName收集的watcher只有计算属性watcher
// 通过栈的形式将先保存渲染watcher 之后保存计算属性watcher
export function pushTarget(watcher) {
  stack.push(watcher) 
  Dep.target = watcher 
}
// 当计算属性取过值之后 调用popTarget ，Dep.target = 渲染watcher
// 在计算属性evaluate之后通过对应的计算属性watcher，拿到对应的deps
// 遍历deps,也就是this.firstName 和 this.lastName的绑定的dep，通过dep再去收集渲染watcher
// 这样就达到目的，一个dep收集多个watcher
export function popTarget() {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}