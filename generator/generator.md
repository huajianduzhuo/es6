# Generator

Generator 函数有多种理解角度。语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。

* [阮一峰 generator 函数的语法](http://es6.ruanyifeng.com/#docs/generator)

## generator 函数

* function 关键字与函数名之间有一个星号
* 函数体内部使用 yield 表达式，定义不同的内部状态

```javascript
function* helloWorldGenerator() {
  yield 'hello'
  yield 'world'
  return 'ending'
}
var hw = helloWorldGenerator()
```

上面代码定义了一个 Generator 函数 helloWorldGenerator，它内部有两个 yield 表达式（ hello 和 world ），即该函数有三个状态：hello，world 和 return 语句（结束执行）。

## 返回

执行 Generator 函数会返回一个遍历器对象（Iterator），也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

## 调用

调用 Generator 函数后，该**函数并不执行**，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，也就是遍历器对象（Iterator Object）。

下一步，必须调用遍历器对象的 next 方法，使得指针移向下一个状态。也就是说，每次调用 next 方法，内部指针就**从函数头部或上一次停下来的地方开始执行**，直到遇到下一个 yield 表达式（或 return 语句）为止。换言之，Generator 函数是分段执行的，yield 表达式是暂停执行的标记，而 next 方法可以恢复执行。

```javascript
hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```

总结一下，调用 Generator 函数，返回一个遍历器对象，代表 Generator 函数的内部指针。以后，每次调用遍历器对象的 next 方法，就会返回一个有着 value 和 done 两个属性的对象。value 属性表示当前的内部状态的值，是 yield 表达式后面那个表达式的值；done 属性是一个布尔值，表示是否遍历结束。

```javascript
// demo 02-generator.js
function* generatorFun() {
  console.log(1)
  yield '卫庄'
  console.log(2)
  yield '盖聂'
  console.log(3)
  return '韩非'
  console.log(4)
}

const it = generatorFun() // 无 log

console.log(it.next()) // 1 { value: "卫庄", done: false }

console.log(it.next()) // 2 { value: '盖聂', done: false }

console.log(it.next()) // 3 { value: '韩非', done: true }

console.log(it.next()) // { value: undefined, done: true }
```

# yield

遍历器对象的 next 方法的运行逻辑如下

* 遇到 yield 表达式，就暂停执行后面的操作，并将紧跟在 yield 后面的那个表达式的值，作为返回的对象的 value 属性值。

* 下一次调用 next 方法时，再继续往下执行，直到遇到下一个 yield 表达式。

* 如果没有再遇到新的 yield 表达式，就一直运行到函数结束，直到 return 语句为止，并将 return 语句后面的表达式的值，作为返回的对象的 value 属性值。

* 如果该函数没有 return 语句，则返回的对象的 value 属性值为 undefined。

## yield 和 return

* 相同点：都能返回紧跟在语句后面的那个表达式的值
* 不同点：
  * 每次遇到 yield，函数暂停执行，下一次再从该位置继续向后执行，而 return 语句不具备位置记忆的功能
  * 一个函数里面，只能执行一次（或者说一个） return 语句，但是可以执行多次（或者说多个） yield 表达式。
  * 正常函数只能返回一个值，因为只能执行一次 return；Generator 函数可以返回一系列的值，因为可以有任意多个 yield。

> yield 表达式只能用在 Generator 函数里面，用在其他地方都会报错。

## yield 表达式在另一个表达式里面

yield 表达式如果用在另一个表达式之中，必须放在圆括号里面。

```javascript
console.log('Hello' + (yield 123)); // OK
```

# next 方法的参数

yield 表达式本身没有返回值，或者说总是返回 undefined。next 方法可以带一个参数，该参数就会被当作上一个 yield 表达式的返回值。

```javascript
function* f() {
  for (var i = 0; true; i++) {
    var reset = yield i
    if (reset) {
      i = -1
    }
  }
}

var g = f()

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false }
```

这个功能有很重要的语法意义。Generator 函数从暂停状态到恢复运行，它的上下文状态（context）是不变的。通过 next 方法的参数，就有办法在 Generator 函数开始运行之后，继续向函数体内部注入值。也就是说，可以在 Generator 函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为。

> 由于 next 方法的参数表示上一个 yield 表达式的返回值，所以在第一次使用 next 方法时，传递参数是无效的。V8 引擎直接忽略第一次使用 next 方法时的参数，只有从第二次使用 next 方法开始，参数才是有效的。从语义上讲，第一个 next 方法用来启动遍历器对象，所以不用带有参数。

# throw()

Generator 函数返回的遍历器对象，都有一个 throw 方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获。

```javascript
var g = function*() {
  try {
    yield
  } catch (e) {
    console.log('内部捕获', e)
  }
}

var i = g()
i.next()

try {
  i.throw('a')
  i.throw('b')
} catch (e) {
  console.log('外部捕获', e)
}
// 内部捕获 a
// 外部捕获 b
```

第一个错误被 Generator 函数体内的 catch 语句捕获。i 第二次抛出错误，由于 Generator 函数内部的 catch 语句已经执行过了，不会再捕捉到这个错误了，所以这个错误就被抛出了 Generator 函数体，被函数体外的 catch 语句捕获。

## 错误捕获

* 如果 Generator 函数内部没有部署 try...catch 代码块，那么 throw 方法抛出的错误，将被外部 try...catch 代码块捕获。

```javascript
var g = function*() {
  while (true) {
    yield
    console.log('内部捕获', e)
  }
}

var i = g()
i.next()

try {
  i.throw('a')
  i.throw('b')
} catch (e) {
  console.log('外部捕获', e)
}
// 外部捕获 a
```

* 如果 Generator 函数内部和外部，都没有部署 try...catch 代码块，那么程序将报错，直接中断执行。

```javascript
var gen = function* gen() {
  yield console.log('hello')
  yield console.log('world')
}

var g = gen()
g.next()
g.throw()
// hello
// Uncaught undefined
```

* throw 方法抛出的错误要被内部捕获，前提是必须至少执行过一次 next 方法。

```javascript
function* gen() {
  try {
    yield 1
  } catch (e) {
    console.log('内部捕获')
  }
}

var g = gen()
g.throw(1)
// Uncaught 1
```

* throw 方法被捕获以后，会附带执行下一条 yield 表达式。也就是说，会附带执行一次 next 方法。

```javascript
var gen = function* gen() {
  try {
    yield console.log('a')
  } catch (e) {
    // ...
  }
  yield console.log('b')
  yield console.log('c')
}

var g = gen()
g.next() // a
g.throw() // b
g.next() // c
```

上面代码中，g.throw 方法被捕获以后，自动执行了一次 next 方法，所以会打印 b。另外，也可以看到，只要 Generator 函数内部部署了 try...catch 代码块，那么遍历器的 throw 方法抛出的错误，不影响下一次遍历。

* Generator 函数体外抛出的错误，可以在函数体内捕获；反过来，Generator 函数体内抛出的错误，也可以被函数体外的 catch 捕获。

```javascript
function* foo() {
  var x = yield 3
  var y = x.toUpperCase()
  yield y
}

var it = foo()

it.next() // { value:3, done:false }

try {
  it.next(42)
} catch (err) {
  console.log(err)
}
```

上面代码中，第二个 next 方法向函数体内传入一个参数 42，数值是没有 toUpperCase 方法的，所以会抛出一个 TypeError 错误，被函数体外的 catch 捕获。

* 一旦 Generator 执行过程中抛出错误，且没有被内部捕获，就不会再执行下去了。如果此后还调用 next 方法，将返回一个 value 属性等于 undefined、done 属性等于 true 的对象，即 JavaScript 引擎认为这个 Generator 已经运行结束了。

```javascript
function* g() {
  yield 1
  console.log('throwing an exception')
  throw new Error('generator broke!')
  yield 2
  yield 3
}

function log(generator) {
  var v
  console.log('starting generator')
  try {
    v = generator.next()
    console.log('第一次运行next方法', v)
  } catch (err) {
    console.log('捕捉错误', v)
  }
  try {
    v = generator.next()
    console.log('第二次运行next方法', v)
  } catch (err) {
    console.log('捕捉错误', v)
  }
  try {
    v = generator.next()
    console.log('第三次运行next方法', v)
  } catch (err) {
    console.log('捕捉错误', v)
  }
  console.log('caller done')
}

log(g())
// starting generator
// 第一次运行next方法 { value: 1, done: false }
// throwing an exception
// 捕捉错误 { value: 1, done: false }
// 第三次运行next方法 { value: undefined, done: true }
// caller done
```

# return()

Generator 函数返回的遍历器对象，还有一个 return 方法，可以返回给定的值，并且终结遍历 Generator 函数。

```javascript
function* gen() {
  yield 1
  yield 2
  yield 3
}

var g = gen()

g.next() // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next() // { value: undefined, done: true }
```

> 如果 return 方法调用时，不提供参数，则返回值的 value 属性为 undefined。

## try...finally

如果 Generator 函数内部有 try...finally 代码块，那么 return 方法会**推迟到 finally 代码块执行完再执行。**

```javascript
function* numbers() {
  yield 1
  try {
    yield 2
    yield 3
  } finally {
    yield 4
    yield 5
  }
  yield 6
}
var g = numbers()
g.next() // { value: 1, done: false }
g.next() // { value: 2, done: false }
g.return(7) // { value: 4, done: false }
g.next() // { value: 5, done: false }
g.next() // { value: 7, done: true }
```

# yield\* 表达式

yield\* 表达式，用来在一个 Generator 函数里面执行另一个 Generator 函数。

```javascript
function* foo() {
  yield 'a'
  yield 'b'
}

function* bar() {
  yield 'x'
  yield* foo()
  yield 'y'
}

// 等同于
function* bar() {
  yield 'x'
  yield 'a'
  yield 'b'
  yield 'y'
}

// 等同于
function* bar() {
  yield 'x'
  for (let v of foo()) {
    yield v
  }
  yield 'y'
}

for (let v of bar()) {
  console.log(v)
}
// "x"
// "a"
// "b"
// "y"
```

从语法角度看，如果 yield 表达式后面跟的是一个遍历器对象，需要在 yield 表达式后面加上星号，表明它返回的是一个遍历器对象。这被称为 yield\*表达式。

yield\*后面的 Generator 函数（**没有 return 语句时**），等同于在 Generator 函数内部，部署一个 for...of 循环。

```javascript
function* concat(iter1, iter2) {
  yield* iter1
  yield* iter2
}

// 等同于

function* concat(iter1, iter2) {
  for (var value of iter1) {
    yield value
  }
  for (var value of iter2) {
    yield value
  }
}
```

上面代码说明，yield* 后面的 Generator 函数（没有 return 语句时），不过是 for...of 的一种简写形式，完全可以用后者替代前者。反之，在**有 return 语句时**，则需要用 `var value = yield* iterator` 的形式获取 return 语句的值。

## yield\* 数组

如果 yield\*后面跟着一个数组，由于数组原生支持遍历器，因此就会遍历数组成员。

```javascript
function* gen() {
  yield* ['a', 'b', 'c']
}

gen().next() // { value:"a", done:false }
```

> 实际上，任何数据结构只要有 Iterator 接口，就可以被 yield\*遍历。

```javascript
let read = (function*() {
  yield 'hello'
  yield* 'hello'
})()

read.next().value // "hello"
read.next().value // "h"
```

## 展开嵌套数组

demo 05-yield-xing.js

```javascript
function* iterTree(tree) {
  if (Array.isArray(tree)) {
    for (let i = 0; i < tree.length; i++) {
      const element = tree[i]
      yield* iterTree(element)
    }
  } else {
    yield tree
  }
}

const arr = [1, [2, 3], [[4, 5], 6]]

console.log([...iterTree(arr)]) // [ 1, 2, 3, 4, 5, 6 ]
```

# 作为对象属性的 generator 函数

```javascript
let obj = {
  * myGeneratorMethod() {
    ···
  }
};
```

# generator 函数的 this

* Generator 函数总是返回一个遍历器，ES6 规定这个遍历器是 Generator 函数的实例，也 **继承了 Generator 函数的 prototype 对象上的方法**。

```javascript
function* g() {}

g.prototype.hello = function() {
  return 'hi!'
}

let obj = g()

obj instanceof g // true
obj.hello() // 'hi!'
```

上面代码表明，Generator 函数 g 返回的遍历器 obj，是 g 的实例，而且继承了 g.prototype。

* 但是，如果把 g 当作普通的构造函数，并不会生效，因为 **g 返回的总是遍历器对象，而不是 this 对象**。

```javascript
function* g() {
  this.a = 11
}

let obj = g()
obj.next()
obj.a // undefined
```

* Generator 函数也**不能跟 new 命令一起用**，会报错。

# 使用 generator 封装异步任务

使用 generator 封装异步任务，由下面的例子可以看出，异步任务定义很简单，但是流程管理很复杂。

demo: 07-async.js，在 index.html 中引入，使用浏览器查看结果

```JavaScript
function* gen() {
 let url = 'https://api.github.com/users/github'
 let result = yield fetch(url)
 console.log(result.bio)
}

let it = gen()
let pro = it.next().value

pro.then(res => {
 return res.json()
}).then(data => {
 it.next(data)
})
```
