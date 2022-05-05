let oldMethods = Array.prototype
export let arrayMethods = Object.create(oldMethods) // 旧数组的原型方法
let methods = [
  'push',
  'shift',
  'unshift',
  'splice',
  'pop',
  'sort',
  'reverse'
]

methods.forEach(method => {
  arrayMethods[method] = function (...args) { // args 是参数列表
  // 这里的this指的是谁调的   比如data: {a:[1,2,3]}  vm.a.push(4) 此时[1,2,3]就为当前的this
    oldMethods[method].call(this, ...args) // 执行旧数组上的方法
    let inserted;
    let ob = this.__ob__ // 在对数组外层观测时 将当前实例挂载的this挂载到__ob__属性
    switch (method) { // 判断如果是push  shift splice 方法  对于新增的属性进行数据劫持 args为新增的数据
      case 'push':
      case 'shift':
        inserted = args 
        break;
      case 'splice': // splice的第二个参数以后都为新增的数据
        inserted = args.slice(2)
        break;
      default:
        break;
    }
    if (inserted) ob.observerArray(inserted) // 通过observerArray递归进行数据劫持
    ob.dep.notify() //如果数据发生变化  通过dep通知对应的watcher进行关联
  }
})