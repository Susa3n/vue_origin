import { globalApi } from './global-api/index'
import {initMixin} from './init'
import { lifecycleMixin } from './lifecycle'
import {renderMixin} from './render'
import {stateMixin} from './state'

function Vue (options) { 
  // options 用户传入的选项
  this._init(options) // 根据选项进行初始化
}

initMixin(Vue) // 给Vue的原型添加_init的方法，传入Vue
renderMixin(Vue) // 给Vue原型添加_c _v _s _render 方法
stateMixin(Vue)
globalApi(Vue) // 全局api
lifecycleMixin(Vue)


// import {compileToFunction} from './compiler/index'
// import {createElm,patch} from './vdom/patch'
// let vm1 = new Vue({
//   data() {
//     return {
//       name:'1'
//     }
//   }
// })

// let oldRender = compileToFunction(`<div a=1 style="color:red;background:blue">
// <li key="A" style="color:blue">A</li>
// <li key="B" style="color:red">B</li>
// <li key="C" style="color:red">C</li>
// <li key="D" >D</li>
// </div>`)
// let oldVnode = oldRender.call(vm1)
// document.body.appendChild(createElm(oldVnode))


// let vm2 = new Vue({
//   data() {
//     return {
//       name:'2'
//     }
//   }
// })
// let newRender = compileToFunction(`<div b=2 style="color:blue;">
// <li key="C" style="color:red">C</li>
// <li key="B" style="color:red">B</li>
// <li key="D" >D</li>
// <li key="A" style="color:blue">A</li>
// <li key="C" style="color:red">C</li>
// <li key="A" style="color:blue">A</li>
// <li key="C" style="color:red">C</li>
// <li key="A" style="color:blue">A</li>
// </div>`)
// let newVnode = newRender.call(vm2)

// setTimeout(() => {
//   patch(oldVnode,newVnode)
// }, 3000);



export default Vue