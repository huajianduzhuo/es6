let p = new Proxy({age: 29}, {
  defineProperty (target, key, propDesc) {
    console.log('propDesc: ', propDesc) // {configurable: true, enumerable: true, value: "白宇", writable: true}
    return false
  }
})
p.name = '白宇' // 没有生效
p.age = 30 // 没有生效。  propDesc 为 { value: 30 }
delete p.age // 可以生效。  没有进入 defineProperty 拦截方法内