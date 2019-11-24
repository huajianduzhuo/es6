参考：[阮一峰Proxy教程](http://es6.ruanyifeng.com/#docs/proxy)

demos代码 GitHub 地址：[https://github.com/huajianduzhuo/es6/tree/master/proxy](https://github.com/huajianduzhuo/es6/tree/master/proxy)

# Proxy

Proxy 用于在目标对象之前架设一层拦截，外界对对象的访问，都必须经过这层拦截。因此可以对外界的访问进行过滤和改写。

## Proxy 构造函数

通过 Proxy 构造函数，来生成 proxy 实例。

```javascript
let target = {}
let proxy = new Proxy(target, handler)
```

`target` 表示需要被代理的目标对象，`handler` 用来定义拦截行为，也是一个对象。

```javascript
let obj = {}
let proxy = new Proxy(obj, {
  get (target, key) {
    return 29
  }
})
console.log(proxy.aaa) // 29
console.log(obj.aaa) // undefined
```

如上，通过定义 `get` 方法，用来拦截所有对 `obj` 对象的访问。因此虽然 `obj` 对象是一个空对象，但是访问 `aaa` 属性，仍能得到结果 29.

> 需要注意的是，要使代理起作用，访问 obj 目标对象时，要通过 `proxy` 实例，直接使用目标对象 obj，代理无作用。

如果 handler 是一个空对象，没有设置任何拦截，则访问 proxy 实例等同于访问 target 目标对象。

```javascript
let obj2 = {}
let proxy2 = new Proxy(obj2, {})
proxy2.bbb = '白宇'
console.log(obj2.bbb) // 白宇
```

## handler 代理配置方法

在 handler 中可以设置的拦截操作如下

### get

`get (target, key, receiver)`

target 为目标对象，key 为属性名，receiver 为原始的读操作所在的对象，一般是 proxy 实例。

拦截访问对象的属性的操作，如 proxy.foo 或 proxy['foo']

```javascript
let obj = {
  name: '白宇',
  say () {}
}
let proxy = new Proxy(obj, {
  get (target, key) {
    console.log('get ' + key)
    return target[key]
  }
})
proxy.name // get name
proxy.say // get say
proxy.say() // get say
```

receiver 有时候不是 proxy 实例，比如当 proxy 实例作为原型的时候，这时 receiver 指向原始的读操作所在的对象

```javascript
let pr = new Proxy({}, {
  get (target, key, receiver) {
    return receiver
  }
})
console.log(pr.a === pr) // true
let ob = Object.create(pr)
console.log(ob.a === pr) // false
console.log(ob.a === ob) // true
```

### set

`set (target, key, value, receiver)`

拦截对对象属性的赋值操作，如 `proxy.foo = 'aaa'`

**作用：**

* 赋值时对属性值进行校验
* 设置私有属性

```javascript
function invariant(key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private '${key}' property`)
  }
}
let proxy = new Proxy({}, {
  get (target, key) {
    invariant(key, 'get')
    return target[key]
  },
  set (target, key, value) {
    invariant(key, 'set')
    if (key === 'age') {
      if (value > 100) {
        throw new Error('the age is invalid')
      }
    }
    target[key] = value
    return true
  }
})
proxy.age = 120 // the age is invalid
proxy.age = 29
proxy._name // Invalid attempt to get private '_name' property
proxy._name = 'baiyu' // Invalid attempt to set private '_name' property
```

> `set` 方法不 return true，在严格模式下会报错。

### has

`has (target, key)`

拦截 `key in proxy` 操作，返回一个布尔值

> `has` 拦截对 `for...in` 循环不生效

```javascript
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
```

### deleteProperty

`deleteProperty (target, key)`

拦截 `delete proxy[key]` 操作，返回一个布尔值

如果该方法返回 false 或报错，则属性无法被删除

```javascript
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
```

### ownKeys

`ownKeys (target)`

拦截以下操作，返回一个数组

* `Object.getOwnPropertyNames(proxy)`
* `Object.getOwnPropertySymbols(proxy)`
* `Object.keys(proxy)`
* `for...in`

### getOwnPropertyDescriptor

`getOwnPropertyDescriptor (target, key)`

拦截 `Object.getOwnPropertyDescriptor(proxy, key)` 操作

### defineProperty

`defineProperty (target, key, propDesc)`

拦截对 target 添加属性、为属性赋值对操作，不拦截删除属性对操作

`return false` 则对属性的操作不生效

```javascript
let p = new Proxy({age: 29}, {
  defineProperty (target, key, propDesc) {
    console.log('propDesc: ', propDesc) // {configurable: true, enumerable: true, value: "白宇", writable: true}
    return false
  }
})
p.name = '白宇' // 没有生效
p.age = 30 // 没有生效。  propDesc 为 { value: 30 }
delete p.age // 可以生效。  没有进入 defineProperty 拦截方法内
```

### preventExtensions

`preventExtensions (target)`

拦截 `Object.preventExtensions(proxy)` 操作

### getPrototypeOf

`getPrototypeOf (target)`

拦截下列操作

* `Object.prototype.__proto__`
* `Object.prototype.isPrototypeOf()`
* `Object.getPrototypeOf()`
* `Reflect.getPrototypeOf()`
* `instanceof`

```javascript
let myProto = {name: '白宇'}
let p = new Proxy({}, {
  getPrototypeOf (target) {
    return myProto
  }
})
console.log(p.__proto__) // {name: "白宇"}
console.log(p.name) // undefined
```

> 返回值必须是对象或 null。如果目标对象不可扩展，则必须返回目标对象的原型对象。

### isExtensible

`isExtensible (target)`

拦截 `Object.isExtensible(proxy)` 操作

* 必须返回布尔值，否则返回值会被自动转为布尔值
* 返回值必须与 target 的 isExtensible 属性保持一致，否则会抛出错误

### setPrototypeOf

`setPrototypeOf (target, proto)`

拦截 `Object.setPrototypeOf(proxy, proto)` 操作

### apply

`apply (target, thisObj, args)`

当 target 为函数时使用，拦截 proxy 作为函数调用的操作。如 `proxy(...args)`、`proxy.call(thisObj, ...args)`、proxy.apply(thisObj, args)

`thisObj` 为目标函数对上下文对象 this，`args` 为参数数组。

```javascript
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
```

### construct

`construct (target, args)`

当 target 为构造函数时使用，拦截 proxy 作为构造函数调用当操作。如 `new proxy(...args)`

```javascript
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
```

## Proxy.revocable()

`Proxy.revocable` 方法返回一个可取消的 Proxy 实例。

```javascript
let {proxy, revoke} = Proxy.revocable({}, {})
proxy.name = '白宇'
console.log(proxy.name) // 白宇
revoke()
console.log(proxy.name) // 报错：Cannot perform 'get' on a proxy that has been revoked
```

`Proxy.revocable` 方法返回一个对象，该对象的 `proxy` 属性是 `Proxy` 实例，`revoke` 属性是一个函数，可以取消 `Proxy` 实例。上面代码中，当执行 `revoke` 函数之后，再访问 `Proxy` 实例，就会抛出一个错误。

`Proxy.revocable` 的一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。

## this 问题

Proxy 代理后，目标对象内部的方法中的 `this` 会指向代理对象

```javascript
let target = {
  fun () {
    console.log(this === p)
    console.log(this === target)
  }
}
let p = new Proxy(target, {})
target.fun() // false true
p.fun() // true false
```

> 此外，有些原生对象的内部属性，只有通过正确的 `this` 才能拿到，所以 `Proxy` 也无法代理这些原生对象的属性。

```javascript
let t = new Date()
let p = new Proxy(t, {})
p.getDate() // 报错：this is not a Date object
```