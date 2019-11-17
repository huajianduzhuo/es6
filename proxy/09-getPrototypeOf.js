let myProto = {name: '白宇'}
let p = new Proxy({}, {
  getPrototypeOf (target) {
    return myProto
  }
})
console.log(p.__proto__) // {name: "白宇"}
console.log(p.name) // undefined