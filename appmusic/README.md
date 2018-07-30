# appmusic 移动端音乐后台
## 前言
因为在爬取数据中,发现有些数据必须是用后台模拟才能爬去，顺便加入了注册登录等功能，就当是连连手了
## 技术栈
1. express后台框架
2. cookie-parser,express-session session管理
3. crypto 密码后台加密
4. multer post请求体解析
5. mysql mysql数据库
6. svg-captcha svg图形验证码
7. request 后台http 请求
## 项目运行
```
git clone https://github.com/xshthebat/3g-music
cd appmusic
npm install //cnpm install
node app.js  //数据爬取node进程  //默认在 8888端口
...
node server.js  //后台个人爬去node进程  //默认在 8881端口
```

## 项目目录
```
├─appmusic
│  │  app.js  //数据爬取
│  │  package-lock.json  //依赖
│  │  package.json  //依赖
│  │  server.js  //个人管理后台
│  │  
│  ├─.vscode
│  │      settings.json  
│  │      
│  ├─api //接口
│  │      adduser.js  //添加个人
│  │      checklogin.js  //邮箱验证
│  │      getvercode.js  //发送验证码
│  │      postemail.js //发送邮箱验证码
│  │      saveimg.js //头像保存
│  │      
│  ├─app  //服务项端目配置
│  │      express.js  //express配置
│  │      
│  │      
│  ├─db  //数据库配置
│  │      db.js    //数据库query封装
│  │      end.js  //连接池断开
│  │      pool.js  //生产连接池配置
│  │      
│  ├─handle //一些方法
│  │      adduser.js   //添加个人
│  │      email.js   //邮箱配置
│  │      findusers.js  //查找个人
│  │      getdefaultimg.js  //设置默认头像
│  │      getimgtobase64.js  //头像转base64
│  │      loginuser.js //用户登陆
│  │      sha1.js //密码加密
│  │      updatauser.js //更新用户数据
│  │      vercode.js  //验证码生产
│  │      
│  ├─stick  //静态文件
│  │  └─defalutimg  //默认头像
│  └─temp //头像存储
│          
```
## License 
MIT
