export function isFunction(value) {
  return typeof value === 'function'
}
export function isObject(value) {
  return typeof value === 'object' && value != null
}

// 生命周期策略模式
const lifecycle = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed']
let strategy = {}
function mergeHook(parentVal, childVal) {
  if (childVal) { // 第一次parentVal是空对象，拿去childValue
    if (parentVal) {
      return parentVal.concat(childVal) // 之后第二次进行合并时parentVal就是第一次合并的[childVal]，进行返回
    } else {
      return [childVal] // 返回[childVal]
    }
  } else {
    return parentVal
  }
}

lifecycle.forEach(key => { // 遍历生命周期的name在strategy中定义函数用来合并生命周期的方法
  strategy[key] = mergeHook
})
export function mergeOptions(parent, child) {
  const options = {}
  for (let key in parent) { // 遍历parent的key
    mergeFiled(key)
  }
  for (let key in child) { 
    if (parent.hasOwnProperty(key)) { // 如果child中的key在parent 跳出循环 
      continue;
    }
    mergeFiled(key) // 如果不在 调用mergeFiled => options[key] = childVal
  }

  function mergeFiled(key) {
    let parentVal = parent[key] // 拿去parent的值
    let childVal = child[key]
    if (strategy[key]) { // 如果当前key属于生命周期中字段
      options[key] = strategy[key](parentVal, childVal) // 合并生命周期
    } else {
      if (isObject(parentVal) && isObject(childVal)) { // 如果是对象形式进行简答的合并 
        options[key] = { ...parentVal, ...childVal }
      } else {
        options[key] = childVal // 如果父中的key是undefined 直接将子中的childVal返回
      }
    }
  }
  return options
}





