import {initMixin} from './init'
function Vue (options) { 
  // options 用户传入的选项
  this._init(options) // 根据选项进行初始化
}

initMixin(Vue) // 给Vue的原型添加_init的方法，传入Vue

export default Vue