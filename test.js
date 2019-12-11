// 演示 jsonwebtoken 的使用

const jwt = require('jsonwebtoken')

// 签发token | 签发令牌
// - payload 需要存放在token中的信息, 一般存放在当前登录的用户名、用户id
// - secret 秘钥, 后续校验token时, 需要使用相同的秘钥来校验
// jwt.sign(payload, secret)

const token = jwt.sign({name: '张三', id: 1}, 'MYGOD')
console.log(token)

// 校验token
// - token 需要校验的token
// - serect 秘钥
// jwt.verify(token, serect)

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoi5byg5LiJIiwiaWQiOjEsImlhdCI6MTU3NjA0NzA5NH0.W_h_TdQg80385sjCI7oFU69VKn4ysAZ0iHRi59A-4KE

const payload = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoi5byg5LiJIiwiaWQiOjEsImlhdCI6MTU3NjA0NzA5NH0.W_h_TdQg80385sjCI7oFU69VKn4ysAZ0iHRi59A-4KE', 'MYGOD')
console.log(payload)
