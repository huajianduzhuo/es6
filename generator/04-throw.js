function* gen() {
  try {
    yield 1
    yield 2
    yield 3
  } catch (error) {
    console.log(error)
  }
  console.log('outter')
}

let it = gen()
it.next()

it.throw('a') // a  outter
it.throw('b') // 报错