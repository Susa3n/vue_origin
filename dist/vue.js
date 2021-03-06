(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }

    return target;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function isFunction(value) {
    return typeof value === 'function';
  }
  function isObject(value) {
    return _typeof(value) === 'object' && value != null;
  } // 生命周期策略模式

  var lifecycle = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];
  var strategy = {};

  function mergeHook(parentVal, childVal) {
    if (childVal) {
      // 第一次parentVal是空对象，拿去childValue
      if (parentVal) {
        return parentVal.concat(childVal); // 之后第二次进行合并时parentVal就是第一次合并的[childVal]，进行返回
      } else {
        return [childVal]; // 返回[childVal]
      }
    } else {
      return parentVal;
    }
  }

  lifecycle.forEach(function (key) {
    // 遍历生命周期的name在strategy中定义函数用来合并生命周期的方法
    strategy[key] = mergeHook;
  });
  function mergeOptions(parent, child) {
    var options = {};

    for (var key in parent) {
      // 遍历parent的key
      mergeFiled(key);
    }

    for (var _key in child) {
      if (parent.hasOwnProperty(_key)) {
        // 如果child中的key在parent 跳出循环 
        continue;
      }

      mergeFiled(_key); // 如果不在 调用mergeFiled => options[key] = childVal
    }

    function mergeFiled(key) {
      var parentVal = parent[key]; // 拿去parent的值

      var childVal = child[key];

      if (strategy[key]) {
        // 如果当前key属于生命周期中字段
        options[key] = strategy[key](parentVal, childVal); // 合并生命周期
      } else {
        if (isObject(parentVal) && isObject(childVal)) {
          // 如果是对象形式进行简答的合并 
          options[key] = _objectSpread2(_objectSpread2({}, parentVal), childVal);
        } else {
          options[key] = childVal; // 如果父中的key是undefined 直接将子中的childVal返回
        }
      }
    }

    return options;
  }

  function globalApi(Vue) {
    Vue.options = {}; // Vue本身有options属性是空对象

    Vue.mixin = function (options) {
      // mixin混入，在这个方法里合并配置对象
      this.options = mergeOptions(this.options, options); // 将用户传的options和本身的options进行合并

      return this;
    };
  }

  var oldMethods = Array.prototype;
  var arrayMethods = Object.create(oldMethods); // 旧数组的原型方法

  var methods = ['push', 'shift', 'unshift', 'splice', 'pop', 'sort', 'reverse'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      var _oldMethods$method;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // args 是参数列表
      // 这里的this指的是谁调的   比如data: {a:[1,2,3]}  vm.a.push(4) 此时[1,2,3]就为当前的this
      (_oldMethods$method = oldMethods[method]).call.apply(_oldMethods$method, [this].concat(args)); // 执行旧数组上的方法


      var inserted;
      var ob = this.__ob__; // 在对数组外层观测时 将当前实例挂载的this挂载到__ob__属性

      switch (method) {
        // 判断如果是push  shift splice 方法  对于新增的属性进行数据劫持 args为新增的数据
        case 'push':
        case 'shift':
          inserted = args;
          break;

        case 'splice':
          // splice的第二个参数以后都为新增的数据
          inserted = args.slice(2);
          break;
      }

      if (inserted) ob.observerArray(inserted); // 通过observerArray递归进行数据劫持

      ob.dep.notify(); //如果数据发生变化  通过dep通知对应的watcher进行关联
    };
  });

  var id$1 = 0;
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++;
      this.sub = [];
    }

    _createClass(Dep, [{
      key: "append",
      value: function append() {
        Dep.target.append(this); // dep添加watcher
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        // 反之 watcher添加dep
        this.sub.push(watcher);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.sub.forEach(function (watcher) {
          return watcher.update();
        }); // 将当前dep中收集到的watcher进行更新
      }
    }]);

    return Dep;
  }();
  Dep.target = null;
  var stack = []; // 第一次进来的是渲染watcher  第二次是计算属性watcher 
  // 计算属性依赖的数据 收集的只有计算属性watcher，渲染watcher没有收集，比如fullName () {return this.firstName + this.lastName}
  // 此时 this.firstName 和 this.lastName收集的watcher只有计算属性watcher
  // 通过栈的形式将先保存渲染watcher 之后保存计算属性watcher

  function pushTarget(watcher) {
    stack.push(watcher);
    Dep.target = watcher;
  } // 当计算属性取过值之后 调用popTarget ，Dep.target = 渲染watcher
  // 在计算属性evaluate之后通过对应的计算属性watcher，拿到对应的deps
  // 遍历deps,也就是this.firstName 和 this.lastName的绑定的dep，通过dep再去收集渲染watcher
  // 这样就达到目的，一个dep收集多个watcher

  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  // 如果是数组 会劫持数组的方法 并对数组上不是基本数据类型的数据进行数据劫持

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // 给要劫持的数据上添加__ob__属性，指定为当前this（两个作用）
      // 一： observe劫持数据时可以通过是否有__ob__属性来判断是否已经劫持过 劫持过直接return
      // 二：调用数组的方法（push、shift、splice...）对于新增的数据，可以通过this.__ob__.observerArray递归劫持
      // data.__ob__ = this   如果直接放到data的属性上，当walk(data)时会遍历__ob__上的属性，导致递归爆栈
      // 解决方法： 通过 Object.defineProperty 设置不可枚举
      this.dep = new Dep();
      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false // 不可枚举

      });

      if (Array.isArray(data)) {
        // 处理数组格式
        // 对数组劫持的逻辑
        data.__proto__ = arrayMethods; // 对数组原来的方法进行重改

        this.observerArray(data); // 对数据中的数据 进行递归劫持
      } else {
        //处理对象格式
        this.walk(data); // 对对象中所有的属性进行数据劫持
      }
    }

    _createClass(Observer, [{
      key: "observerArray",
      value: function observerArray(data) {
        for (var i = 0; i < data.length; i++) {
          // 遍历数组中的每一项 劫持数据
          observe(data[i]);
        }
      }
    }, {
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          // 遍历data拿到所有的key
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function observeArray(value) {
    if (Array.isArray(value)) {
      // 是数组类型 进行遍历
      value.forEach(function (currentValue) {
        var ob = observe(currentValue); // 拿去下一层的dep实例 如果有进行下一层关联

        if (ob) {
          ob.dep.append();
        }

        observeArray(currentValue); // 递归关联
      });
    }
  }

  function defineReactive(data, key, value) {
    // 将数据定义为响应式
    var dep = new Dep(); // 数据劫持时给数据绑定对应的dep

    var childOb = observe(value); // value可能还是对象  递归进行劫持,value是数组或value时，为了将value的dep的和视图watcher进行关联，此时childOb是数组或对象的dep实例

    Object.defineProperty(data, key, {
      get: function get() {
        // 在watcher中读取对应数据 会判断Dep.target是否是watcher
        if (Dep.target) {
          // 如果是
          dep.append(); // 将当前dep（也就是当前数据）进行关联

          if (childOb) {
            // 如果有值 数组去关联视图watcher
            childOb.dep.append();
            observeArray(value); // 递归将下一层的数据进行关联watcher  [[[1,2,3]]]
          }
        }

        return value;
      },
      set: function set(newValue) {
        // 如果set的newValue是一个对象 也要对对象进行劫持
        if (newValue != value) {
          observe(newValue);
          value = newValue;
          dep.notify(); // 通知对应观察者执行操作
        }
      }
    });
  }

  function observe(data) {
    // 观测数据
    // 判断用户返回的data是否是对象 如果不是直接返回
    if (!isObject(data)) {
      return;
    }

    if (data.__ob__) {
      return data.__ob__;
    } // data最外层默认是对象


    return new Observer(data); // 返回一个实例
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

  var callbacks = [];
  var waiting = false;

  function flushCallbacks() {
    callbacks.forEach(function (cb) {
      return cb();
    });
    waiting = false;
    callbacks = [];
  }

  function timerFn() {
    var timer = null;

    if (Promise) {
      // 
      timer = function timer() {
        Promise.resolve().then(function () {
          flushCallbacks();
        });
      };
    } else if (MutationObserver) {
      var textNode = document.createTextNode(1);
      var observe = new MutationObserver(flushCallbacks);
      observe.observe(textNode, {
        characterData: true
      });

      timer = function timer() {
        textNode.textContent = 3;
      };
    } else {
      timer = setTimeout(flushCallbacks);
    }

    timer();
  }

  function nextTick(cb) {
    // 接收一个回调函数
    callbacks.push(cb); // push到callbacks中

    if (!waiting) {
      // 异步执行一次 
      timerFn();
      waiting = true;
    }
  }

  var queue = [];
  var has = {};
  var pending = false;

  function flushSchedulerQueue() {
    queue.forEach(function (watcher) {
      // 从queue遍历所有的watcher 进行更新
      watcher.run();
      queue = []; // 让下一次可以继续使用 清空数据

      has = {};
      pending = false;
    });
  }

  function queueWatcher(watcher) {
    var id = watcher.id; // 拿取watcher的id

    if (has[id] == null) {
      // 判断当前watcher是否在has对象中
      queue.push(watcher); // 将当前watcher push 到对列中

      has[id] = true; // has中保存watcher的id置为true

      if (!pending) {
        // 默认false 之后置为true 只让更新操作改为异步的，执行nexttick
        // setTimeout(flushSchedulerQueue,0);
        nextTick(flushSchedulerQueue); // 执行异步更新视图的方法

        pending = true;
      }
    }
  }

  var id = 0;
  var Watcher = /*#__PURE__*/function () {
    /**
     *  Watcher是一个类，生成一个观察者
     * @param {*} vm 被观测的对象或者数据
     * @param {*} exprOrFn  被观测的对象发生变化执行对应操作（渲染watcher是函数，在computed或者watch中是表达式）
     * @param {*} cb 执行完对应操作后的回调函数
     * @param {*} options 配置对象
     */
    function Watcher(vm, exprOrFn, cb, options) {
      _classCallCheck(this, Watcher);

      // 将传入的参数保存到实例本身
      this.vm = vm;
      this.cb = cb; // 保存回调函数

      this.options = options;
      this.user = options.user; // 用户watch

      this.lazy = !!options.lazy; // 计算属性watch 初次不加载

      this.dirty = options.lazy; // 计算属性watch 默认是脏的 

      if (typeof exprOrFn == 'string') {
        // 如果是用户watch exprOrFn是一个表达式 'name' 'person.nam'
        this.getter = function () {
          // getter为一个函数，通过表达式的取值 将watcher 和 表达式的dep进行关联
          var obj = vm;
          exprOrFn.split('.').forEach(function (i) {
            obj = obj[i];
          });
          return obj;
        };
      } else {
        this.getter = exprOrFn; // 挂载到实例的getter属性上，当被观测的数据发生变化 执行this.get
      }

      this.id = id++;
      this.deps = [];
      this.depIds = new Set();
      this.value = this.lazy ? undefined : this.get(); // 默认第一次执行 拿到watcher的值 保存到实例上，以便用户watcher发生变化执行callback传入对应新值和旧值
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        // 利用JS的单线程
        pushTarget(this); // 开始：将watcher（页面）和dep（数据） 进行关联起来

        var value = this.getter.call(this.vm); // 读取对应数据 

        popTarget();
        return value;
      }
    }, {
      key: "append",
      value: function append(dep) {
        // 接收dep
        if (!this.depIds.has(dep.id)) {
          // 判断当前watcher中depIds中是否有当前dep
          this.depIds.add(dep.id); // 将接收的dep的id set到当前watcher实例depIds

          this.deps.push(dep); // 将dep保存到watcher的deps中

          dep.addSub(this); // 反之将watcher关联到dep中
        }
      }
    }, {
      key: "update",
      value: function update() {
        // 当前观察者执行对应操作
        // this.get()
        // 如果数据改变通知对应watcher进行update，当多次更改数据时，会导致多次渲染页面，可以将渲染界面改为异步
        // 通过queueWatcher收集watcher，之后进行异步更新
        if (this.lazy) {
          // 如果当前watcher是计算属性watcher dirty为true是脏的
          this.dirty = true;
        } else {
          queueWatcher(this);
        }
      }
    }, {
      key: "run",
      value: function run() {
        var oldValue = this.value; // 当监听的值发生变化保存旧值在当前作用域

        var newValue = this.value = this.get(); // 保存新值到实例上 用于下次更新

        if (this.user) {
          this.cb.call(this.vm, newValue, oldValue); // 如果是用户watcher 执行回调函数 传入参数
        }
      }
    }, {
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get(); // 调用计算属性的getter函数

        this.dirty = false; // 脏值变为不脏的  

        return this.value; // 返回计算属性的值
      }
    }, {
      key: "depend",
      value: function depend() {
        var i = this.deps.length; // 拿去当前计算属性上的dep，拿到每个dep关联渲染watcher

        while (i--) {
          this.deps[i].append();
        }
      }
    }]);

    return Watcher;
  }(); // watcher 和 dep
  // 我们将更新界面的功能封装了一个渲染watcher
  // 渲染页面前，会将watcher放到Dep的类上  Dep.target = watcher
  // 在vue中页面渲染时使用属性，需要进行依赖收集，收集对象的渲染watcher
  // 取值时给每个属性都加了一个dep实例，用于存储渲染watcher（同一个watcher可能存有多个dep）
  // 每个属性可能对应多个视图（多个视图就对应多个watcher） 一个属性对应多个watcher
  // dep.depend() => 通知dep存放watcher  Dep.target.addDep () => 通知watcher存放dep

  function initState(vm) {
    var opts = vm.$options;

    if (opts.data) {
      // 如果选项中有data
      initData(vm); // 对data进行初始化
    }

    if (opts.computed) {
      initComputed(vm, opts.computed);
    }

    if (opts.watch) {
      initWatch(vm, opts.watch);
    }
  }

  function initData(vm) {
    // 初始化data方法
    var data = vm.$options.data; // vm中$符号开头的属性不会被代理
    // vue2中会将所有层次的数据进行数据劫持 通过Object.defineProperty
    // call的原因 data中所有数据的this都指向当前实例 vm

    data = vm._data = isFunction(data) ? data.call(vm) : data;

    for (var key in data) {
      // 通过proxy代理将data上的数据定义vm上，当读取属性时还是走的observe
      proxy(vm, '_data', key);
    } // 观测数据 将数据变为响应式的


    observe(data);
  }

  function initComputed(vm, computed) {
    var watchers = vm._computedWatchers = {}; // 保存一份计算属性的watchers到vm实例上，以便可以通过key和vm找到对应的计算属性watcher

    for (var key in computed) {
      // 遍历计算属性
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get; // 判断单个计算属性是函数或者是对象，拿到定义的函数

      watchers[key] = new Watcher(vm, getter, function () {}, {
        lazy: true
      }); // 生成计算属性watcher 传入vm  getter 配置对象默认lazy为true 初次不渲染 

      deReactiveComputed(vm, key, userDef); // 将computed属性的key通过Object.defineProperty定义到vm
    }
  }

  function createComputedGetter(key) {
    return function () {
      var computedWatcher = this._computedWatchers[key]; // 通过vm和key拿到对应的watcher

      if (computedWatcher.dirty) {
        // 判断当前watcher是否是脏值 dirty:true
        computedWatcher.evaluate(); // 取值
      }

      if (Dep.target) {
        // 取值之后 渲染watcher继续收集计算属性watcher上的dep
        computedWatcher.depend();
      }

      return computedWatcher.value; // 将值返回
    };
  }

  function deReactiveComputed(vm, key, userDef) {
    // 定义计算属性的key响应式
    var shareComputedFn = {};
    shareComputedFn.get = createComputedGetter(key), // 如果userDef是对象，通过key去找到对应的watcher,再通过watcher调用getter
    shareComputedFn.set = userDef.set;
    Object.defineProperty(vm, key, shareComputedFn);
  }

  function initWatch(vm, watch) {
    var _loop = function _loop(key) {
      // 遍历watch
      var handler = watch[key];

      if (Array.isArray(handler)) {
        // 判断value的类型，如果是数组类型 需要创建多个用户watch
        handler.forEach(function (handlerFn) {
          createWatch(vm, key, handlerFn);
        });
      } else {
        if (_typeof(handler) === 'object') {
          // 如果是对象类型 取出handler函数，收集配置对象，创建用户watch
          createWatch(vm, key, handler.handler, handler);
        } else {
          createWatch(vm, key, handler); // 如果是函数 直接创建用户watchr
        }
      }
    };

    // 初始化watch方法
    for (var key in watch) {
      _loop(key);
    }
  }

  function createWatch(vm, key, handler) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    return vm.$watch(key, handler, options); // 通过$watch进行中转
  } // 数据代理


  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }

  function stateMixin(Vue) {
    Vue.prototype.$watch = function (key, handler, options) {
      // 在Vue的原型上混入$watch的方法 创建用户监听
      options.user = true; // 配置对象 用户watch为true

      var userWatcher = new Watcher(this, key, handler, options); // 生产watch实例传入 当前vm，表达式，callback，配置对象

      if (options.immediate) {
        handler(userWatcher.value);
      }
    };
  } // 初始化computed：
  // 遍历computed 分为两个部分 一个部分创建watcher 另外通过Object.defineProperty定义computed的key
  // 定义的watcher 默认是脏的，只有脏的才会从新取值（缓存）
  // 当watcher计算属性依赖数据发生改变 dirty 脏值为true。且依赖数据的dep收集完计算属性的watcher后还要收集渲染watcher，发生改变渲染视图

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // abc-aaa

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <aaa:asdads>
  //  /^<((?:[a-zA-Z_][\-\.0-9_a-zA-Z]*\:)?[a-zA-Z_][\-\.0-9_a-zA-Z]*)/

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名 
  // /^<\/((?:[a-zA-Z_][\-\.0-9_a-zA-Z]*\:)?[a-zA-Z_][\-\.0-9_a-zA-Z]*)[^>]*>/

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >  <div>

  var ELEMENT_TYPE = 1; // 标签节点  

  var TEXT_TYPE = 3; // 文本节点
  // 将html字符串通过正则的形式解析出ast

  function parserHtml(html) {
    // <div id="app"></app>
    var root = null;
    var currParent;
    var stack = [];

    while (html) {
      // 循环解析
      var textEnd = html.indexOf('<'); // 查看是否以<开头

      if (textEnd == 0) {
        var startTagMatch = parseStartTag(); // 解析开始标签

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        var endTagMatch = parseEndTag();

        if (endTagMatch) {
          end(endTagMatch[1]);
          continue;
        }
      }

      var text = void 0;

      if (textEnd > 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        chars(text);
        advance(text.length);
      }
    }

    function parseStartTag() {
      var start = html.match(startTagOpen); // 将模板字符串匹配开始标签

      if (start) {
        // 匹配到 创建match对象保存当前 开始标签名 默认属性为空
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); // 截取已经匹配到的开始标签

        var _end, attr; // 循环匹配 不结束标签 和 属性 当两者同时成立时 拿去匹配到的属性名和属性值 push到 match中 


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length); // 截取已经匹配到的属性
        }

        if (_end) {
          // 当匹配到结束标签时
          advance(_end[0].length);
          return match;
        }
      }
    }

    function parseEndTag() {
      var endTagMatch = html.match(endTag); // 将模板字符串匹配开始标签

      advance(endTagMatch[0].length);
      return endTagMatch;
    }

    function advance(len) {
      html = html.substring(len);
    }

    function start(tagName, tagAttrs) {
      var element = createElement(tagName, tagAttrs);

      if (!root) {
        root = element;
      }

      stack.push(element);
      currParent = element;
    }

    function end(tagName) {
      var currentElement = stack.pop();
      var parentElement = stack[stack.length - 1];

      if (tagName == currentElement.tag) {
        if (parentElement) {
          parentElement.children.push(currentElement);
          currentElement.parent = parentElement;
        }
      }
    }

    function chars(text) {
      text = text.replace(/\s/g, '');

      if (text) {
        currParent.children.push({
          type: TEXT_TYPE,
          text: text
        });
      }
    }

    return root;
  }

  function createElement(tagName, attrs) {
    return {
      type: ELEMENT_TYPE,
      tag: tagName,
      children: [],
      attrs: attrs,
      parent: null
    };
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配插值语法

  function geneProps(attrs) {
    var props = "";
    attrs.forEach(function (attr) {
      // 遍历当前节点的属性list  {id:'app',class:'classA',style: {font-size: '14px',color:'red'}}
      if (attr.name === 'style') {
        // 如果当前属性item的name为style {font-size: '14px';color:'red'}
        var obj = {}; // 定义空对象

        attr.value.split(';').forEach(function (styleItem) {
          // 拿到当前value进行split  [font-size: '14px',color:'red']
          var _styleItem$split = styleItem.split(':'),
              _styleItem$split2 = _slicedToArray(_styleItem$split, 2),
              key = _styleItem$split2[0],
              value = _styleItem$split2[1]; // [key: 'font-size',value: '14px']  [key: 'color',value: 'red']


          obj[key] = "".concat(value); // obj = {font-size: '14px',color: 'red'}
        });
        attr.value = obj; // attr.style = {font-size: '14px',color: 'red'}
      }

      props += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ","); // 如果name不是style,直接拼:props = id:'app',class:'classA',style:{font-size: '14px';color:'red'}
    });
    return "{".concat(props.slice(0, -1), "}"); // return {id:'app',class:'classA',style:{font-size: '14px';color:'red'}}
  }

  function gen(node) {
    if (node.type == 1) {
      // 如果当前节点为为标签节点  递归调用generate方法
      return generate(node);
    } else {
      // 如果是文本节点
      var text = node.text; // 获取文本内容

      var tokens = []; // 定义空数组 方便依次递加

      var match;
      var lastIndex = defaultTagRE.lastIndex = 0; // defaultTagRE插值语法{{}} 匹配每次用exec匹配时候默认最后一次匹配项为0

      while (match = defaultTagRE.exec(text)) {
        // while循环去匹配当前text = "hello  {{name}}  word"
        var index = match.index; //开始索引 第一次匹配到的index  hello  的长度

        if (index > lastIndex) {
          // 将hello  push到tokens中
          tokens.push(JSON.stringify(text.slice(lastIndex, index))); // 截取普通字符串
        }

        tokens.push("_s(".concat(match[1].trim(), ")")); // 截取插值语法字符串push到tokens中

        lastIndex = index + match[0].length; // 将当前lastIndex = hello  {{name}}的长度 循环匹配直至最后一次 
      }

      if (lastIndex < text.length) {
        // 将最后的  word push到tokens中
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")"); // 转为字符串return
    }
  }

  function geneChildren(root) {
    var children = root.children; // 拿到当前children 判断children是否大于0 继续转化子节点 

    if (children && children.length > 0) {
      return children.map(function (c) {
        return gen(c);
      }).join(',');
    } else {
      return false;
    }
  }

  function generate(root) {
    // 传入ast语法树
    var children = geneChildren(root); // 转化当前传入的root.children
    //  geneProps(root.attrs) 转化 当前节点的属性

    var code = "_c('".concat(root.tag, "',").concat(root.attrs.length > 0 ? geneProps(root.attrs) : undefined).concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  function compileToFunction(template) {
    var root = parserHtml(template); // 编译模板字符串 转为 ast语法

    var code = generate(root);
    var render = new Function("with(this){ return ".concat(code, "}")); // console.log(render.call(vm));

    return render;
  } // vue2 模板编译的顺序
  // template模板 通过正则while匹配 匹配成ast语法（组合成树）
  // ast => 递归遍历每个节点  编译成code字符串 _c('div',{id: 'app'},_c(span,undefined,_v('hello'+ _s(name) + 'world')))
  // 生成render函数（new Function + with）
  // return  render函数 通过.call调用 指定with参数this 
  // let obj = {name:'sau3n'}
  // with(obj) {
  //   console.log(name);
  // }

  function patch(oldElm, vnode) {
    var isRealDom = oldElm && oldElm.nodeType;

    if (isRealDom) {
      var el = createElm(vnode); // 根据虚拟节点创建真实节点

      var parentElm = oldElm.parentNode; // 拿去旧节点的父节点 body

      parentElm.insertBefore(el, oldElm.nextSibling); // 在旧节点的下一个节点钱插入编译好的真实节点

      parentElm.removeChild(oldElm); // 移除旧的节点 进行模板替换

      return el; // 将渲染好的真实节点返回
    } else {
      // 对比虚拟节点 替换真实节点
      if (oldElm.tagName !== vnode.tagName) {
        // 如果节点的名称不同 找到父节点进行替换
        oldElm.el.parentNode.replaceChild(createElm(vnode), oldElm.el);
      }

      if (!oldElm.tagName) {
        // 如果是文本节点 当前oldElm.tagName为undefined
        if (oldElm.text !== vnode.text) {
          // 对比文本内容 如果不同进行赋值
          oldElm.el.textContent = vnode.text;
        }
      }

      var _el = vnode.el = oldElm.el; // 将真实dom赋值给新虚拟节点的el属性
      // 对比属性  传入新虚拟节点 和 旧节点的属性


      updateProps(vnode, oldElm.data); // 对比孩子属性

      var newChildren = vnode.children || [];
      var oldChildren = oldElm.children || [];

      if (newChildren.length > 0 && oldChildren.length > 0) {
        // 如果children的长度都大于0
        patchChildren(_el, newChildren, oldChildren); // 对比孩子节点 传入 （父节点,新虚拟节点list,旧虚拟节点list）
      } else if (newChildren.length > 0) {
        // 如果新虚拟节点length大于0 旧虚拟节点length = 0
        newChildren.forEach(function (i) {
          // 遍历新虚拟节点 依次添加父节点的子节点
          _el.appendChild(createElm(i));
        });
      } else if (oldChildren.length > 0) {
        // 如果旧虚拟节点length大于0 新虚拟节点length = 0
        oldChildren.forEach(function (i) {
          // // 遍历新虚拟节点 依次从父节点移除子节点
          _el.removeChild(i.el);
        });
      }

      return _el;
    }
  }
  function createElm(vnode) {
    var tagName = vnode.tagName;
        vnode.data;
        vnode.key;
        var children = vnode.children,
        text = vnode.text;

    if (tagName) {
      // 如果是元素节点
      vnode.el = document.createElement(tagName); // 创建元素节点

      updateProps(vnode); // 更新当前节点的属性

      if (children && children.length > 0) {
        // 判断当前节点是否有子节点
        children.forEach(function (child) {
          // 遍历子节点
          return vnode.el.appendChild(createElm(child)); //将子节点添加到父节点上
        });
      }
    } else {
      // 如果是文本节点
      vnode.el = document.createTextNode(text); // 返回文本节点
    }

    return vnode.el; // 返回当前编译好的当前元素节点 用于添加子节点 最后将编译好的根节点返回
  }

  function isSameTag(newChild, oldChild) {
    return newChild.tagName === oldChild.tagName && newChild.key == oldChild.key;
  }

  function updateProps(vnode) {
    var oldVnodeData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // 更新当前节点的属性
    var el = vnode.el; // 拿去当前真实dom

    var newData = vnode.data || {}; // 拿去当前节点的属性

    var oldData = oldVnodeData; // 拿去旧节点的属性 默认为空对象

    var newStyle = newData.style || {}; // 拿去当前虚拟节点样式属性

    var oldStyle = oldVnodeData.style || {}; // 拿去旧虚拟节点样式属性

    for (var key in oldStyle) {
      // 遍历旧样式属性
      if (!newStyle[key]) {
        // 如果新样式属性中没有当前key
        el.style[key] = ""; // 真实dom的style属性的key置为空
      }
    }

    for (var _key in oldData) {
      // 同理遍历旧虚拟节点的属性
      if (!newData[_key]) {
        // 如果新虚拟节点的属性没有当前key
        el.removeAttribute(_key); // 真实dom移除当前属性
      }
    }

    for (var _key2 in newData) {
      // 遍历属性
      if (Object.hasOwnProperty.call(newData, _key2)) {
        if (_key2 === 'style') {
          // 如果当前属性key为style
          for (var _key3 in newData.style) {
            // 遍历style对象
            el.style[_key3] = newData.style[_key3]; // 给当前真实节点添加样式
          }
        } else if (_key2 === 'class') {
          // 如果当前key是class 给当前真实节点添加class
          el.className = newData["class"];
        } else {
          el.setAttribute(_key2, newData[_key2]); // 设置其他属性比如 a:1 <div a="1">
        }
      }
    }
  }

  function makeChildrenMap(children) {
    var map = {};
    children.forEach(function (item, index) {
      if (item.key) {
        map[item.key] = index;
      }
    });
    return map;
  } // 双指针对比孩子虚拟节点


  function patchChildren(parent, newChildren, oldChildren) {
    var newStartIndex = 0;
    var newStartVnode = newChildren[0];
    var newEndIndex = newChildren.length - 1;
    var newEndVnode = newChildren[newEndIndex];
    var oldStartIndex = 0;
    var oldStartVnode = oldChildren[0];
    var oldEndIndex = oldChildren.length - 1;
    var oldEndVnode = oldChildren[oldEndIndex]; // 收集旧虚拟节点的子节点 存在map中{key:index}

    var map = makeChildrenMap(oldChildren);

    while (newStartIndex <= newEndIndex && oldStartIndex <= oldEndIndex) {
      if (oldStartVnode == null) {
        //因为暴力对比,匹配到的节点为置为null  所以当遇到节点为null的向下递加向上递减
        oldStartVnode = oldChildren[++oldStartIndex];
      } else if (oldEndVnode == null) {
        oldEndVnode = oldChildren[--oldEndIndex]; // 如果新虚拟节点的开头 和 旧虚拟节点的开头 相同
      } else if (isSameTag(newStartVnode, oldStartVnode)) {
        patch(oldStartVnode, newStartVnode); // 对比子节点 

        newStartVnode = newChildren[++newStartIndex];
        oldStartVnode = oldChildren[++oldStartIndex]; // 如果新虚拟节点的结尾 和 旧虚拟节点的结尾 相同
      } else if (isSameTag(newEndVnode, oldEndVnode)) {
        patch(oldEndVnode, newEndVnode);
        oldEndVnode = oldChildren[--oldEndIndex];
        newEndVnode = newChildren[--newEndIndex]; // 如果新虚拟节点的结尾 和 旧虚拟节点的开始 相同
      } else if (isSameTag(newEndVnode, oldStartVnode)) {
        patch(oldStartVnode, newEndVnode);
        parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
        oldStartVnode = oldChildren[++oldStartIndex];
        newEndVnode = newChildren[--newEndIndex]; // 如果新虚拟节点的开始 和 旧虚拟节点的结尾 相同
      } else if (isSameTag(newStartVnode, oldEndVnode)) {
        patch(oldEndVnode, newStartVnode);
        parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
        newStartVnode = newChildren[++newStartIndex];
        oldEndVnode = oldChildren[--oldEndIndex];
      } else {
        // 暴力对比  
        // 未进入while之前 已经存了map对象 {key:index}
        // 如果之前的条件都未成立 通过新虚拟节点的key 去map中查找 到index 
        var moveIndex = map[newStartVnode.key];

        if (!moveIndex) {
          // 如果没查找到 将虚拟节点转为真实dom 添加到父节点中
          parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
        } else {
          // 通过index 可以拿到旧虚拟节点
          var moveVnode = oldChildren[moveIndex];
          patch(moveVnode, newStartVnode); // 对比节点

          oldChildren[moveIndex] = null; // 将旧节点置为null 进行占位

          parent.insertBefore(moveVnode.el, oldStartVnode.el); // 添加真实dom
        }

        newStartVnode = newChildren[++newStartIndex];
      }
    } // 当跳出while循环
    // 新的子节点开始大于结尾  
    // 遍历开始和结尾的长度 通过newChildren拿到虚拟dom 从父节点中添加


    if (newStartIndex <= newEndIndex) {
      for (var i = newStartIndex; i <= newEndIndex; i++) {
        // newChildren[newEndIndex+1] 代表从开始加或者从结尾加
        var el = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;
        parent.insertBefore(createElm(newChildren[i]), el);
      }
    } // 旧的子节点开始大于结尾
    // 遍历开始和结尾的长度 父节点中移除子节点


    if (oldStartIndex <= oldEndIndex) {
      for (var _i = oldStartIndex; _i <= oldEndIndex; _i++) {
        if (!oldChildren[_i]) {
          parent.removeChild(oldChildren[_i].el);
        }
      }
    }
  } // 首先 判断 旧的虚拟节点是否为元素节点 nodeType
  // 如果是元素节点代表是真实的dom 需要进行渲染操作
  // 递归遍历虚拟节点 创建真实节点 在这一过程中将虚拟节点的data属性 挂载到生成真实dom节点的属性上

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      // 混入_update更新界面的方法 接收参数（执行render函数后生成的对象）
      var vm = this;
      var preNode = vm.vnode; // vm上取虚拟节点  第一次编译时为undefined

      vm.vnode = vnode; // 之后进行赋值

      if (!preNode) {
        // 没有虚拟节点 用编译后的虚拟节点创建出真实节点 替换掉 真实的$el
        vm.$el = patch(vm.$el, vnode); // 我要通过虚拟节点 渲染出真实的dom
      } else {
        // 有虚拟节点  前后进行对比替换
        vm.$el = patch(preNode, vnode);
      }
    }, Vue.prototype.$nextTick = nextTick;
  } // 后续可能还会调用此函数 数据刷新更新界面

  function mountComponent(vm, el) {
    vm.$options;
    vm.$el = el;

    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    }; // updateComponent()


    callHook(vm, 'beforeMount');
    new Watcher(vm, updateComponent, function () {
      console.log('更新界面');
    }, true);
  } //  在数据劫持的过程中所有的数据绑定对应dep 
  // 需要将数据和页面进行关联起来，数据发生变化自动进行更新视图，调用渲染函数 mountComponent
  // 创建观察者模式，属性是“被观察者” 渲染函数是“观察者”，当被观察者发生改变，观察者执行对应操作
  // Watcher 创建一个类的实例  是观察者
  // 参数1：传入被观测的数据，
  // 参数2：被观察者发生变化后执行观察者的操作
  // 参数3：用户自定义的回调函数，执行完观察者的操作后悔调用回调函数
  // 参数4：配置参数，如果是渲染watcher 配置参数默认为true

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; // 缓存this 保存到当前作用域
      // vm.$options = options  // 将选项保存到实例的$options

      vm.$options = mergeOptions(vm.constructor.options, options); // 将用户传入的options和实例本身进行合并
      // 比如使用时在外部调用了Vue.mixin方法全局混入要和实例进行合并
      // 这里用vm.constructor.options的原因 是因为有可能当前调用_init方法的是继承的形式  Vue.extend

      callHook(vm, 'beforeCreate');
      initState(vm); // 对数据进行初始化 比如 data  computed watch ...

      callHook(vm, 'created');

      if (vm.$options.el) {
        vm.$mount(vm.$options.el); // 挂载界面，如果当前配置项有el属性，传入当前el
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el);

      if (!options.render) {
        // render配置项高于el
        var template = options.template;

        if (!template && el) {
          // 判断配置项是否有template属性  如果没有就拿el的outerHTML
          template = el.outerHTML; // 模板字符串  之后通过正则进行匹配 将模板字符串转为render渲染函数

          var render = compileToFunction(template); // 拿到render函数

          options.render = render; // 挂载到配置项中，以后数据发生变化 可以通过配置项直接执行渲染函数
        }
      }

      mountComponent(vm, el); // 拿到render函数后 渲染界面
    };
  }
  function callHook(vm, key) {
    var handlers = vm.$options[key];

    if (handlers) {
      handlers.forEach(function (hook) {
        hook.call(vm);
      });
    }
  }

  function createElementNode(tagName) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // 编译节点 最终返回一个对象
    var key = data.key;

    if (key) {
      delete data.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tagName, data, key, children, undefined);
  }
  function createTextNode(text) {
    // 翻译文本内容
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  function vnode(tagName, data, key, children, text) {
    // 节点名称  节点属性 节点key 子节点  文本内容
    return {
      tagName: tagName,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      // 编译元素节点
      return createElementNode.apply(void 0, arguments);
    };

    Vue.prototype._v = function (text) {
      // 编译文本节点
      return createTextNode(text);
    };

    Vue.prototype._s = function (val) {
      // 编译插值语法 
      return val === null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val; // 如果取到当前值是对象 需要stringify转化
    };

    Vue.prototype._render = function () {
      var render = this.$options.render; // 拿到配置对象中的render方法 

      return render.call(this); // 调用 render方法 this指向当前实例  返回执行render函数后 产生的一个对象
    };
  } //  _c('div',{id:"app",class:"warp",style:{"font-size":" 16px","color":"red"}},_c('span',undefined,_v("hello"+_s(name)+"word")),_c('ul',undefined,_c('li',undefined,_v(_s(person.name))),_c('li',undefined,_v(_s(person.age)))))}

  function Vue(options) {
    // options 用户传入的选项
    this._init(options); // 根据选项进行初始化

  }

  initMixin(Vue); // 给Vue的原型添加_init的方法，传入Vue

  renderMixin(Vue); // 给Vue原型添加_c _v _s _render 方法

  stateMixin(Vue);
  globalApi(Vue); // 全局api

  lifecycleMixin(Vue); // import {compileToFunction} from './compiler/index'

  return Vue;

}));
//# sourceMappingURL=vue.js.map
