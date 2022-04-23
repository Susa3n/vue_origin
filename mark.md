安装依赖包
- rollup  用来打包的工具类似webpack
- @babel/core  babel的核心包，使用rollup打包时利用babel的核心包用来转义
- @babel/preset-env babel的预设包可以将一些es6+的高级语法转为es5
- rollup-plugin-babel 插件 rollup和babel并无直接关联 利用插件将rollup和babel关联起来