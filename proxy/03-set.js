/* function invariant(key, action) {
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
proxy._name = 'baiyu' // Invalid attempt to set private '_name' property */
'use strict'
const handler = {
  set: function(obj, prop, value, receiver) {
    obj[prop] = receiver;
    return true
  }
};
const proxy = new Proxy({}, handler);
const myObj = {};
Object.setPrototypeOf(myObj, proxy);

myObj.foo = 'bar';
console.log(myObj.foo === myObj )