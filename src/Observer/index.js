
import { isObject } from "../utils";
import { arrayMethods } from './Array'
import { Dep } from './dep'

// 如果数据是对象 会对对象递归 进行数据劫持
// 如果是数组 会劫持数组的方法 并对数组上不是基本数据类型的数据进行数据劫持

class Observer {
  constructor(data) {
    // 给要劫持的数据上添加__ob__属性，指定为当前this（两个作用）
    // 一： observe劫持数据时可以通过是否有__ob__属性来判断是否已经劫持过 劫持过直接return
    // 二：调用数组的方法（push、shift、splice...）对于新增的数据，可以通过this.__ob__.observerArray递归劫持
    // data.__ob__ = this   如果直接放到data的属性上，当walk(data)时会遍历__ob__上的属性，导致递归爆栈
    // 解决方法： 通过 Object.defineProperty 设置不可枚举
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false // 不可枚举
    })
    if (Array.isArray(data)) { // 处理数组格式
      // 对数组劫持的逻辑
      data.__proto__ = arrayMethods  // 对数组原来的方法进行重改
      this.observerArray(data) // 对数据中的数据 进行递归劫持
    } else { //处理对象格式
      this.walk(data) // 对对象中所有的属性进行数据劫持
    }
  }
  observerArray(data) {
    for (let i = 0; i < data.length; i++) { // 遍历数组中的每一项 劫持数据
      observe(data[i])
    }
  }

  walk(data) {
    Object.keys(data).forEach(key => { // 遍历data拿到所有的key
      defineReactive(data, key, data[key])
    })
  }


}

function defineReactive(data, key, value) { // 将数据定义为响应式
  let dep = new Dep() // 数据劫持时给数据绑定对应的dep
  observe(value) // value可能还是对象  递归进行劫持
  Object.defineProperty(data, key, {
    get() { // 在watcher中读取对应数据 会判断Dep.target是否是watcher
      if(Dep.target) { // 如果是
        dep.append() // 将当前dep（也就是当前数据）进行关联
      }
      return value
    },
    set(newValue) {
      // 如果set的newValue是一个对象 也要对对象进行劫持
      if(newValue !=  value) {
        observe(newValue)
        value = newValue
        dep.notify() // 通知对应观察者执行操作
      }
    }
  })
}


export function observe(data) { // 观测数据
  // 判断用户返回的data是否是对象 如果不是直接返回
  if (!isObject(data)) {
    return
  }

  if (data.__ob__) {
    return
  }

  // data最外层默认是对象
  return new Observer(data) // 返回一个实例
}


/**
 * data(){
 *  return {
 *      person: [{name:'susa3n'}]
 *    }
 * }
 * 完整的初始化流程：
 *  observe最开始观测data时，最外层是对象形式，遍历所有的key，进行数据劫持，
 * 将当前实例挂载到数组上__ob__ = this，当发现第二层值为数组时，调用observerArray方法，传入当前值，遍历数组进行递归劫持。
 * vm.person.push({name:'lisi'}) 执行旧数组原型上的方法 对新增的数据 通过__ob__.observerArray(args)
 *
 */