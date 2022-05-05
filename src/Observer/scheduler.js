import { nextTick } from '../next-tick'
let queue = []
let has = {}
let pending = false


function flushSchedulerQueue() {
  queue.forEach(watcher => { // 从queue遍历所有的watcher 进行更新
    watcher.run()
    queue = []; // 让下一次可以继续使用 清空数据
    has = {};
    pending = false
  })
}

export function queueWatcher(watcher) {
  let id = watcher.id // 拿取watcher的id
  if (has[id] == null) { // 判断当前watcher是否在has对象中
    queue.push(watcher) // 将当前watcher push 到对列中
    has[id] = true // has中保存watcher的id置为true
    if (!pending) { // 默认false 之后置为true 只让更新操作改为异步的，执行nexttick
      // setTimeout(flushSchedulerQueue,0);
      nextTick(flushSchedulerQueue)  // 执行异步更新视图的方法
      pending = true
    }

  }
}