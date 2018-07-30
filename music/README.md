# 3gmusic移动端应用
## 开发初衷
因为刚学vue,没有项目来练手,故在网上看到有些music的项目,感觉非常适合用来练习,故自己写了一个,并且加入了一些新东西,并且修改了在移动端上的bug.因为第一次写一个完整的项目,还有不足...
## 技术栈
1. Vue2.X mvvm框架
2. Vuex 状态管理
3. vue-cli官方脚手架
4. ES6
5. axios，jsonp网络请求
6. flex布局
7. alloyginger fastclick 移动端触屏事件
## 项目运行
```
git clone https://github.com/xshthebat/3g-music
cd music
npm install //cnpm install
npm run dev //运行
npm run build //打包
```
配合后台使用更佳

## 项目路径
```
music
    │  .babelrc //babel转译
    │  .editorconfig
    │  .gitignore //gitignore
    │  .postcssrc.js
    │  index.html   //html文件
    │  package-lock.json
    │  package.json  //依赖
    │  README.md //readme
    │  
    ├─build   //build.js打包配置
    │     
    ├─config  //webpack配置文件
    │      
    ├─dist //打包后项目
    │  │  index.html  //打包后的html
    │  │  
    │  └─static  //js css等文件
    │              
    ├─src
    │  │  App.vue   //app 根组件
    │  │  main.js   //app 根js
    │  │  
    │  ├─api
    │  │      config.js     //网络请求常用参数
    │  │      getvercode.js   //获取验证码api
    │  │      lgoin.js   //后台 注册登陆 以及验证登陆api
    │  │      rank.js   //获取排行榜api
    │  │      recommend.js  //获取推荐api
    │  │      saveimg.js  //保存头像api
    │  │      search.js  //查找api
    │  │      singer.js  //歌手查询api
    │  │      song.js  //歌曲查询api
    │  │      
    │  ├─base //基础组件
    │  │      buttombox.vue   //按钮组件
    │  │      confirm.vue   //弹窗组件
    │  │      imgupdata.vue  //头像上传组件
    │  │      inputbox.vue  //输入框组件
    │  │      listview.vue   //歌曲列表和图片封面组件
    │  │      loading.vue   //加载中组件
    │  │      messagebox.vue  //信息组件
    │  │      messageupdata.vue  //信息提交组件
    │  │      noresult.vue  //无结果组件
    │  │      password.vue  //密码强度输入组件
    │  │      progressbar.vue  //歌曲进度条组件
    │  │      progresscircle.vue   //圆形歌曲组件
    │  │      scroll.vue   //滑动组件
    │  │      searchbox.vue   //搜索框组件
    │  │      searchlist.vue  //搜索结果列表组件
    │  │      slide.vue  //轮播图组件
    │  │      songlist.vue //歌曲列表组件
    │  │      vercodes.vue  //验证码组件
    │  │      xmusiclist.vue //横向歌曲列表组件
    │  │      
    │  ├─common
    │  │  ├─css  //公用css
    │  │  │      base.css  
    │  │  │      index.css  
    │  │  │      reset.css
    │  │  │      
    │  │  ├─font //字体
    │  │  ├─image  //图片
    │  │  │      
    │  │  └─js
    │  │          config.js  //js常用配置参数
    │  │          dom.js    //dom常用操作函数
    │  │          jsonp.js  //jsonp再封装 
    │  │          mixin.js  //mixin混入 处理迷你播放器布局问题
    │  │          password.js  //密码强度计算函数
    │  │          Singer.js  //歌手对象封装
    │  │          song.js //歌曲对象封装以及对应方法
    │  │          store.js //localstorage存储读取封装
    │  │          uid.js //公用js
    │  │          util.js //公用js
    │  │          
    │  ├─components    //组件
    │  │      checkcode.vue  //登陆验证
    │  │      login.vue  //注册登陆
    │  │      logincode.vue  //注册验证
    │  │      mheader.vue  //顶部
    │  │      musiclist.vue //歌曲列表
    │  │      person.vue //个人页面
    │  │      player.vue  //播放器内核
    │  │      playlist.vue //播放列表
    │  │      rank.vue //排行榜
    │  │      rankdetail.vue //旁行榜详情
    │  │      recommend.vue //推荐
    │  │      search.vue   //搜索
    │  │      singer.vue //歌手
    │  │      singerdetail.vue  //歌手详情
    │  │      songListdetail.vue //歌曲详情
    │  │      suggest.vue //推荐
    │  │      tab.vue  //导航栏
    │  │      
    │  ├─router //路由管理
    │  │      index.js  //路由配置
    │  │      
    │  └─store //vuex管理
    │          actions.js  //vuex action配置
    │          getters.js //vuex getter配置
    │          index.js //vuex 总配置导入
    │          mutation-types.js  // vuex mutation名字
    │          mutations.js  //vux mutation配置
    │          state.js  //vuex state配置
    │          
    └─static //静态文件
```
## 项目预览图
1. 主体界面

<img src="https://github.com/xshthebat/gitimg/blob/master/AFXEIR5~YS%24M%24CDE7A%25Z%5B%40K.png" width="400" height="700"></img>
<img src="https://github.com/xshthebat/gitimg/blob/master/55TO0TX)F%2540%5D%5D%7D3E3KC~%5DI.png" width="400" height="700"></img>
<img src="https://github.com/xshthebat/gitimg/blob/master/YNBI%24SZB%25%5BZ58C70%7DM1D53W.png" width="400" height="700"></img>
<img src="https://github.com/xshthebat/gitimg/blob/master/_2Y%24V()41(I07QN5SZRXQMH.png" width="400" height="700"></img>
<img src="https://github.com/xshthebat/gitimg/blob/master/%5BC6CO0V5O%24GBKJSH_R8W76K.png" width="400" height="700"></img>

2. 播放器

<img src="https://github.com/xshthebat/gitimg/blob/master/8PHHBIFT%5B%24%7DNGV%7BXN1%40SB%24D.png" width="400" height="700"></img>
<img src="https://github.com/xshthebat/gitimg/blob/master/1UTCC%7DM~)~4FJAY4ZXXW78E.png" width="400" height="700"></img>

3. 注册登陆个人界面

<img src="https://github.com/xshthebat/gitimg/blob/master/BZZ%5D%24L35NF_~KM)0%60%24~YRU7.png" width="400" height="700"></img>
<img src="https://github.com/xshthebat/gitimg/blob/master/%7B4%5DQDB)0V(QM_R4~BFNZIKI.png" width="400" height="700"></img>

## 免责声明 
歌曲来自qq音乐接口 本app不做任何商业用途只做练习使用,侵权必删。
## License 
MIT
