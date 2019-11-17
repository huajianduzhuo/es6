let obj = {}
let proxy = new Proxy(obj, {
  get (target, key) {
    return 29
  }
})
console.log(proxy.aaa) // 29
console.log(obj.aaa) // undefined

let obj2 = {}
let proxy2 = new Proxy(obj2, {})
proxy2.bbb = '白宇'
console.log(obj2.bbb) // 白宇