function Fun(firstName, lastName) {
  this.fullName = lastName + firstName
}
let proxyFun = new Proxy(Fun, {
  construct (target, args) {
    console.log(args) // ['宇', '白']
    let res = new target(...args)
    res.age = 29
    return res
  }
})
console.log(new proxyFun('宇', '白')) // Fun {fullName: '白宇', age: 29}