const express = require('express')
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

const UserModel = require('./models/user')

const server = express()

// 处理 req.body
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

// 处理mongodb的链接
const uri = 'mongodb://127.0.0.1:27017/damai'
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('数据库连接成功')
}).catch(() => {
    console.log('数据库连接失败')
})

// 登录
server.post('/api/login', async(req, res) => {
    // 接收前端传递过来的参数
    const username = req.body.username
    const password = req.body.password

    let isOk = false
    const user = await UserModel.findOne({ username })

    if (user) {
        // 比较密码是否一致
        isOk = await bcryptjs.compare(password, user.password)
    }

    if (isOk) {
        res.send({
            code: 0,
            msg: '登录成功'
        })
    } else {
        res.send({
            code: -1,
            msg: '用户名或密码不正确'
        })
    }

    res.send({
        code: 0,
        msg: '登陆成功'
    })
})

// 注册
server.post('/api/registry', async(req, res) => {
    // 获取前端传递过来的参数
    const username =  req.body.username
    const password = req.body.password

    const user = new UserModel({
        username:username,
        password: await bcryptjs.hash(password,10)
    })

    await user.save()

    res.send({
        code: 0,
        msg: '注册成功'
    })
})

server.listen(3000)
