import { isFunction } from "./utils" // 引入工具函数判断当前值是否是函数类型
import { observe } from "./observer/index"
import { Watcher } from "./observer/watcher"
import { Dep } from "./observer/dep"
export function initState(vm) {
  const opts = vm.$options
  if (opts.data) { // 如果选项中有data
    initData(vm) // 对data进行初始化
  }
  if (opts.computed) {
    initComputed(vm, opts.computed)
  }
  if (opts.watch) {
    initWatch(vm, opts.watch)
  }
}

function initData(vm) { // 初始化data方法
  let data = vm.$options.data // vm中$符号开头的属性不会被代理
  // vue2中会将所有层次的数据进行数据劫持 通过Object.defineProperty

  // call的原因 data中所有数据的this都指向当前实例 vm
  data = vm._data = isFunction(data) ? data.call(vm) : data
  for (const key in data) { // 通过proxy代理将data上的数据定义vm上，当读取属性时还是走的observe
    proxy(vm, '_data', key)
  }
  // 观测数据 将数据变为响应式的
  observe(data)
}

function initComputed(vm, computed) {
  let watchers = vm._computedWatchers = {} // 保存一份计算属性的watchers到vm实例上，以便可以通过key和vm找到对应的计算属性watcher
  for (const key in computed) { // 遍历计算属性
    let userDef = computed[key]
    let getter = typeof userDef === 'function' ? userDef : userDef.get // 判断单个计算属性是函数或者是对象，拿到定义的函数
    watchers[key] = new Watcher(vm, getter, () => { }, { lazy: true }) // 生成计算属性watcher 传入vm  getter 配置对象默认lazy为true 初次不渲染 
    deReactiveComputed(vm, key, userDef) // 将computed属性的key通过Object.defineProperty定义到vm
  }
}

function createComputedGetter(key) {
  return function () {
    let computedWatcher = this._computedWatchers[key] // 通过vm和key拿到对应的watcher
    if (computedWatcher.dirty) { // 判断当前watcher是否是脏值 dirty:true
      computedWatcher.evaluate()  // 取值
    }
    if (Dep.target) { // 取值之后 渲染watcher继续收集计算属性watcher上的dep
      computedWatcher.depend()
    }
    return computedWatcher.value // 将值返回
  }
}

function deReactiveComputed(vm, key, userDef) { // 定义计算属性的key响应式
  let shareComputedFn = {}
  shareComputedFn.get = createComputedGetter(key), // 如果userDef是对象，通过key去找到对应的watcher,再通过watcher调用getter
    shareComputedFn.set = userDef.set
  Object.defineProperty(vm, key, shareComputedFn)
}


function initWatch(vm, watch) { // 初始化watch方法
  for (const key in watch) { // 遍历watch
    let handler = watch[key]
    if (Array.isArray(handler)) { // 判断value的类型，如果是数组类型 需要创建多个用户watch
      handler.forEach(handlerFn => {
        createWatch(vm, key, handlerFn)
      })
    } else {
      if (typeof handler === 'object') { // 如果是对象类型 取出handler函数，收集配置对象，创建用户watch
        createWatch(vm, key, handler.handler, handler)
      } else {
        createWatch(vm, key, handler) // 如果是函数 直接创建用户watchr
      }
    }
  }
}

function createWatch(vm, key, handler, options = {}) {

  return vm.$watch(key, handler, options) // 通过$watch进行中转
}


// 数据代理
function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}

export function stateMixin(Vue) {
  Vue.prototype.$watch = function (key, handler, options) { // 在Vue的原型上混入$watch的方法 创建用户监听
    options.user = true // 配置对象 用户watch为true
    let userWatcher = new Watcher(this, key, handler, options) // 生产watch实例传入 当前vm，表达式，callback，配置对象
    if (options.immediate) {
      handler(userWatcher.value)
    }
  }
}

// 初始化computed：
  // 遍历computed 分为两个部分 一个部分创建watcher 另外通过Object.defineProperty定义computed的key
  // 定义的watcher 默认是脏的，只有脏的才会从新取值（缓存）
  // 当watcher计算属性依赖数据发生改变 dirty 脏值为true。且依赖数据的dep收集完计算属性的watcher后还要收集渲染watcher，发生改变渲染视图