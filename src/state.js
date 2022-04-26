import { isFunction } from "./utils" // 引入工具函数判断当前值是否是函数类型
import { observe } from "./observer/index"
export function initState(vm) {
  const opts = vm.$options 
  if(opts.data) { // 如果选项中有data
    initData(vm) // 对data进行初始化
  }
  // if(opts.computed){
  //   initComputed()

  // }
  // if(opts.watch){
  //   initWatch()
  // }
}

function initData(vm) { // 初始化data方法
  let data = vm.$options.data // vm中$符号开头的属性不会被代理
  // vue2中会将所有层次的数据进行数据劫持 通过Object.defineProperty

  // call的原因 data中所有数据的this都指向当前实例 vm
  data = vm._data = isFunction(data) ? data.call(vm) : data 
  for (const key in data) { // 通过proxy代理将data上的数据定义vm上，当读取属性时还是走的observe
    proxy(vm,'_data',key)
  }
  // 观测数据 将数据变为响应式的
  observe(data)
}

function proxy(vm,source,key) {
  Object.defineProperty(vm,key,{
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}