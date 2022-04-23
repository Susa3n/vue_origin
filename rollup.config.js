import babel from 'rollup-plugin-babel'
export default {
  input: './src/index.js',
  output:{
    format: 'umd', // 打包的格式
    name: 'Vue', // 打包后的名称 会挂载到全局 window.Vue
    file: 'dist/vue.js',
    sourcemap:true, // es5 -> es6 代码映射 
  },
  plugins: [
    babel({
      exclude: 'node_modules/**' // glob语法  ** 代码任意文件
    })
  ]
}