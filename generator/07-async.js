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