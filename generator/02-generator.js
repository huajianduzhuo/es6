function* generatorFun () {
  console.log(1)
  yield "卫庄"
  console.log(2)
  yield "盖聂"
  console.log(3)
  return "韩非"
  console.log(4)
}

const it = generatorFun() // 无 log

console.log(it.next()) // 1 { value: "卫庄", done: false }

console.log(it.next()) // 2 { value: '盖聂', done: false }

console.log(it.next()) // 3 { value: '韩非', done: true }

console.log(it.next()) // { value: undefined, done: true }


/** 
 * return 的 韩非， done 为 true，在 for...of 循环中不遍历
 */
const it2 = generatorFun()

for (const i of it2) {
  console.log(i) // 1 卫庄 2 盖聂 3 
}