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