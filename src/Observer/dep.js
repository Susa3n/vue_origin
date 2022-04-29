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
export function pushTarget(watcher) {
  Dep.target = watcher
}

export function popTarget() {
  Dep.target = null
}