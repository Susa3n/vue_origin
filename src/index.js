import {initMixin} from './init'
import { lifecycleMixin } from './lifecycle'
import {renderMixin} from './render'
function Vue (options) { 
  // options 用户传入的选项
  this._init(options) // 根据选项进行初始化
}

initMixin(Vue) // 给Vue的原型添加_init的方法，传入Vue
renderMixin(Vue) // 给Vue原型添加_c _v _s _render 方法
lifecycleMixin(Vue)
export default Vue