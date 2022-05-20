import { globalApi } from './global-api/index'
import {initMixin} from './init'
import { lifecycleMixin } from './lifecycle'
import {renderMixin} from './render'
import {stateMixin} from './state'
import {compileToFunction} from './compiler/index'
import {createElm,patch} from './vdom/patch'
function Vue (options) { 
  // options 用户传入的选项
  this._init(options) // 根据选项进行初始化
}

initMixin(Vue) // 给Vue的原型添加_init的方法，传入Vue
renderMixin(Vue) // 给Vue原型添加_c _v _s _render 方法
stateMixin(Vue)
globalApi(Vue) // 全局api
lifecycleMixin(Vue)


// let vm1 = new Vue({
//   data: {
//     name: 'susa3n',
//     age: 11
//   }
// });
// let render1 = compileToFunction(`<div style="color:red">
// <li key="A">A</li>
// <li key="B">B</li>
// <li key="C">C</li>
// <li key="D">D</li>
// </div>`)
// let vnode1 = render1.call(vm1)
// let realNode = createElm(vnode1)
// document.body.appendChild(realNode)


// let vm2 = new Vue({
//   data: {
//     name: 'zf',
//     age: 11
//   }
// });
// let render2 = compileToFunction(`<div id='a'>
// <li key="B">B</li>
// <li key="A">A</li>
// <li key="D">D</li>
// <li key="C">C</li>
// </div>`);
// let vnode2 = render2.call(vm2);
// setTimeout(() => {
//   patch(vnode1, vnode2); // 传入两个虚拟节点 会在内部进行比对
// }, 3000);





export default Vue