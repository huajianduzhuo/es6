function fun(name, age) {
  console.log("他的名字是" + name + "，今年" + age + "岁了。")
}
let proxyFun = new Proxy(fun, {
  apply (target, thisObj, args) {
    console.log(thisObj)
    console.log(args) // ['白宇', 29]
    return target(...args)
  }
})
proxyFun('白宇', 29) // thisObj 为 undefined
proxyFun.apply({}, ['白宇', 29]) // thisObj 为 {}