/* let target = {
  fun () {
    console.log(this === p)
    console.log(this === target)
  }
}
let p = new Proxy(target, {})
target.fun() // false true
p.fun() // true false */

let t = new Date()
let p = new Proxy(t, {})
p.getDate() // 报错：this is not a Date object