function* generatorFun () {
  console.log('hello ' + (yield))
  console.log('hello ' + (yield '卫庄'))
}

/** 
 * yield 表达式如果用在另一个表达式之中，必须放在圆括号里面
 * yield 表达式没有返回值，或者说总是返回 undefined
 */
const it = generatorFun()

it.next() // no log
it.next() // hello undefined
it.next() // hello undefined

const it2 = generatorFun()

console.log(it2.next()) // { value: undefined, done: false }
console.log(it2.next()) // hello undefined  { value: '卫庄', done: false }
console.log(it2.next()) // hello undefined  { value: undefined, done: true }