let src = {name: '白宇'}
let tar = Object.create(src)
tar.age = 29
let p = new Proxy(tar, {
  has (target, key) {
    console.log('in proxy')
    return key in target
  }
})
console.log('name' in p) // in proxy , true
for (const key in p) {
  console.log(p[key]) // 29, 白宇
}