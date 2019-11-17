let {proxy, revoke} = Proxy.revocable({}, {})
proxy.name = '白宇'
console.log(proxy.name) // 白宇
revoke()
console.log(proxy.name) // 报错：Cannot perform 'get' on a proxy that has been revoked