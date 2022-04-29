
let callbacks = []
let waiting = false 

function flushCallbacks() {
  callbacks.forEach(cb => cb())
  waiting = false
  callbacks = []
}

function timerFn() {
  let timer = null
  if(Promise) { // 
    timer = () => {
      Promise.resolve().then(() => {
        flushCallbacks()
      })
    }
  }else if(MutationObserver) {
    let textNode = document.createTextNode(1)
    let observe = new MutationObserver(flushCallbacks)
    observe.observe(textNode,{
      characterData: true
    })
    timer = () => {
      textNode.textContent = 3
    }
  }else {
    timer = setTimeout(flushCallbacks);
  }
  timer()
}

export function nextTick(cb) { // 接收一个回调函数
  callbacks.push(cb) // push到callbacks中
  if(!waiting){ // 异步执行一次 
    timerFn()
    waiting = true
  }
}
