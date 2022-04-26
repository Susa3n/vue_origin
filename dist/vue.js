(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

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
    };
  });

  // 如果是数组 会劫持数组的方法 并对数组上不是基本数据类型的数据进行数据劫持

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // 给要劫持的数据上添加__ob__属性，指定为当前this（两个作用）
      // 一： observe劫持数据时可以通过是否有__ob__属性来判断是否已经劫持过 劫持过直接return
      // 二：调用数组的方法（push、shift、splice...）对于新增的数据，可以通过this.__ob__.observerArray递归劫持
      // data.__ob__ = this   如果直接放到data的属性上，当walk(data)时会遍历__ob__上的属性，导致递归爆栈
      // 解决方法： 通过 Object.defineProperty 设置不可枚举
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

  function defineReactive(data, key, value) {
    // 将数据定义为响应式
    observe(value); // value可能还是对象  递归进行劫持

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        // 如果set的newValue是一个对象 也要对对象进行劫持
        observe(newValue);
        value = newValue;
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
      return;
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

  function initState(vm) {
    var opts = vm.$options;

    if (opts.data) {
      // 如果选项中有data
      initData(vm); // 对data进行初始化
    } // if(opts.computed){
    //   initComputed()
    // }
    // if(opts.watch){
    //   initWatch()
    // }

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

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // abc-aaa

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <aaa:asdads>
  //  /^<((?:[a-zA-Z_][\-\.0-9_a-zA-Z]*\:)?[a-zA-Z_][\-\.0-9_a-zA-Z]*)/

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名 
  // /^<\/((?:[a-zA-Z_][\-\.0-9_a-zA-Z]*\:)?[a-zA-Z_][\-\.0-9_a-zA-Z]*)[^>]*>/

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >  <div>

  var root = null;
  var currParent;
  var stack = [];
  var ELEMENT_TYPE = 1; // 标签节点  

  var TEXT_TYPE = 3; // 文本节点
  // 将html字符串通过正则的形式解析出ast

  function parserHtml(html) {
    // <div id="app"></app>
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

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配插值语法

  function geneProps(attrs) {
    var props = "";
    attrs.forEach(function (attr) {
      if (attr.name === 'style') {
        var obj = {};
        attr.value.split(';').forEach(function (styleItem) {
          var _styleItem$split = styleItem.split(':'),
              _styleItem$split2 = _slicedToArray(_styleItem$split, 2),
              key = _styleItem$split2[0],
              value = _styleItem$split2[1];

          obj[key] = "".concat(value);
        });
        attr.value = obj;
      }

      props += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    });
    return "{".concat(props.slice(0, -1), "}");
  }

  function gen(node) {
    if (node.type == 1) {
      return generate(node);
    } else {
      var text = node.text;
      var tokens = [];
      var match;
      var lastIndex = defaultTagRE.lastIndex = 0;

      while (match = defaultTagRE.exec(text)) {
        var index = match.index; //开始索引

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index))); // 截取普通字符串
        }

        tokens.push(match[1].trim()); // 截取插值语法字符串

        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(text.slice(lastIndex));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function geneChildren(root) {
    var children = root.children;

    if (children && children.length > 0) {
      return children.map(function (c) {
        return gen(c);
      }).join(',');
    } else {
      return false;
    }
  }

  function generate(root) {
    var children = geneChildren(root);
    var code = "_c('".concat(root.tag, "',").concat(root.attrs.length > 0 ? geneProps(root.attrs) : undefined).concat(children ? ",".concat(children) : '', ")");
    console.log(code);
    return code;
  }

  function compileToFunction(template) {
    var root = parserHtml(template); // 编译模板字符串 转为 ast语法

    generate(root); // console.log(code);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; // 缓存this 保存到当前作用域

      vm.$options = options; // 将选项保存到实例的$options
      // 对数据进行初始化 比如 data  computed watch ...

      initState(vm);

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

          var render = compileToFunction(template);
          options.render = render; // 挂载到配置项中，以后数据发生变化 可以通过配置项直接执行渲染函数
        }
      }
    };
  }

  function Vue(options) {
    // options 用户传入的选项
    this._init(options); // 根据选项进行初始化

  }

  initMixin(Vue); // 给Vue的原型添加_init的方法，传入Vue

  return Vue;

}));
//# sourceMappingURL=vue.js.map
