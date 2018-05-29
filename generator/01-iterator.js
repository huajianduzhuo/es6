const it = {
  count: 0,
  [Symbol.iterator] () {
    return {
      next () {
        if (it.count++) {
          return {value: '卫庄', done: true}
        } else {
          return {value: '盖聂', done: false}
        }
      }
    }
  }
}

const b = {}
b[Symbol.iterator] = Array.prototype[Symbol.iterator].bind([1,2,3,4])

/** 
 * done 为 true 的 value，在 for...of 循环中不遍历
 */
for (const i of it) {
  console.log(i) // 盖聂
}

for (const i of b) {
  console.log(i) // 1 2 3 4
}

const itb = b[Symbol.iterator]()
