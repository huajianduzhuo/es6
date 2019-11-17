let obj = {_name: 'white', name: '白宇'}
let p = new Proxy(obj, {
  deleteProperty (target, key) {
    if (key[0] === '_') {
      throw new Error(`private property ${key} cannot be deleted`)
    }
    delete target[key]
    return true
  }
})
delete p.name // 成功删除
delete p._name // 报错：private property _name cannot be deleted
