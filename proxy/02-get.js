/* let obj = {
  name: '白宇',
  say () {
  }
}
let proxy = new Proxy(obj, {
  get (target, key) {
    console.log('get ' + key)
    return target[key]
  }
})
proxy.name // get name
proxy.say // get say
proxy.say() // get say */

let pr = new Proxy({}, {
  get (target, key, receiver) {
    return receiver
  }
})
console.log(pr.a === pr) // true
let ob = Object.create(pr)
console.log(ob.a === pr) // false
console.log(ob.a === ob) // true