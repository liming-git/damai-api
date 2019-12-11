const express = require("express");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("./models/user");

const server = express();

// 处理 req.body
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// 处理mongodb的链接
const uri = "mongodb://127.0.0.1:27017/damai";
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("数据库连接成功");
  })
  .catch(() => {
    console.log("数据库连接失败");
  });

// 登录
server.post("/api/login", async (req, res) => {
  // 接收前端传递过来的参数
  const username = req.body.username;
  const password = req.body.password;

  let isOk = false;
  const user = await UserModel.findOne({ username });

  if (user) {
    // 比较密码是否一致
    isOk = await bcryptjs.compare(password, user.password);
  }

  if (isOk) {
    // 签发一个token
    const token = jwt.sign(
      { username: user.username, userId: user._id },
      "MYGOD"
    );

    // 将token返回给前端
    res.send({
      code: 0,
      msg: "登录成功",
      data: {
        userInfo: user.username,
        userId: user._id
      },
      token: token
    });
  } else {
    res.send({
      code: -1,
      msg: "用户名或密码不正确"
    });
  }

  res.send({
    code: 0,
    msg: "登陆成功"
  });
});

// 注册
server.post("/api/registry", async (req, res) => {
  // 获取前端传递过来的参数
  const username = req.body.username;
  const password = req.body.password;

  const user = new UserModel({
    username: username,
    password: await bcryptjs.hash(password, 10)
  });

  await user.save();

  res.send({
    code: 0,
    msg: "注册成功"
  });
});

// 定义一个校验用户TOKEN的中间件函数
const Auth = (req, res, next) => {
  const token = req.get("ACCESS_TOKEN");
  try {
    const payload = jwt.verify(token, "MYGOD");
    // 直接将 payload 的信息, 写入到req 身上, 然后续的代码直接通过req.user就能获取到当前的登录用户的信息
    req.user = payload;
    next();
  } catch (error) {
    res.send({
      code: -1,
      msg: "校验失败"
    });
  }
};

// 获取卡券 (只是为了实现用户的校验)
server.get("/api/card", Auth, async (req, res) => {
  res.send({
    code: 0,
    msg:'获取卡券成功',
    userId: req.user.userId,
    username: req.user.username
  })

  //   // 1. 获取当前的登录的用户id
  //   // 2. 返回用户的id, 和用户名

  //   // 从请求头中获取 ACCESS_TOKEN 的值
  //   const token = req.get("ACCESS_TOKEN");
  //   // 通过 jwt.verify 去校验token
  //   try {
  //     const payload = jwt.verify(token, "MYGOD");
  //     res.send({
  //       code: 0,
  //       userId: payload.userId,
  //       username: payload.username
  //     });
  //   } catch (error) {
  //       res.send({
  //           code: -1,
  //           msg: 'token验证失败'
  //       })
  //   }
});

server.listen(3000);
