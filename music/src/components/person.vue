<template>
    <div class="personinf">
               <!-- 顶部 -->
               <div class="loginback" @click="back"><i class="back-icon"></i></div>
                  <div class="dislogin"><i class="dislogin-icon" @click="dislogins"></i></div>
                  <div class="logintitle"><p class="title_p">{{title}}</p></div>
               <scroll class="scroll-wraper" ref="scroll">
                 <div class="scroll-box">
                  <!-- 中部 -->
                  <div class="userbox">
                  <div class="userimg">
                    <img class="personimg" :src="imgsrc"  ref="img" @click="changeimg" :class="{imgchage:imgchage}">
                  </div>
                  </div>
                  <div class="usermessage">
                  <messagebox class="messageboxs" :messagename="`用户名`" :messagemain="usernum" @messagechange="change"></messagebox>
                  <messagebox class="messageboxs" :messagename="`昵称`" :messagemain="username" @messagechange="change"></messagebox>
                  <messagebox class="messageboxs" :messagename="`个性签名`" :messagemain="userwords" @messagechange="change"></messagebox>
                  <xmusiclist :data="likelist" v-show="likelist.length" :title="`我的收藏`"></xmusiclist>
                  <p v-show="!likelist.length" class="showp">还没有喜欢的歌,快去收藏几首吧</p>
                  <xmusiclist :data="userHistory" v-show="userHistory.length" :title="`我的历史`"></xmusiclist>
                   <p v-show="!userHistory.length" class="showp">没有听歌，快去听几首吧</p>
                  <div :class="{'scroll-bottom1':bottom,'scroll-bottom2':!bottom}" ref="scroll-bottom"></div>
                  </div>
               </div>
               </scroll>
               <router-view></router-view>
        <imgupdata ref="imgupdata" @back="chooseback" :imgsrc="imgsrc"></imgupdata>    
        <confirm :text="`确认退出登陆吗？`" @sure="sureout" @canel="notsureout" ref="confirm"></confirm>
        <messageupdata ref="messageupdata" :messagename="key" :placeholder="val"></messageupdata>
    </div>    
</template>
<script>
import messageupdata from "../base/messageupdata";
import confirm from "../base/confirm";
import messagebox from "../base/messagebox";
import imgupdata from "../base/imgupdata";
import { mapGetters, mapMutations, mapActions } from "vuex";
import scroll from "../base/scroll";
import xmusiclist from "../base/xmusiclist";
import {playlistMixin} from "../common/js/mixin.js";
export default {
  mixins:[playlistMixin],
  data() {
    return {
      title: "个人信息",
      imgchage: false,
      imgbig: false,
      key: null,
      val: "",
      bottom:true
    };
  },
  activated() {
    if (!this.login) {
      this.$router.push("/");
    }
  },
  methods: {
    handlePlaylist(val){
      // console.log(val);
      if(val.length){
         this.bottom = false;
      this.$refs.scroll.refresh();
      } else{
         this.bottom = true;
      this.$refs.scroll.refresh();
      }
    },
    change({ key, val }) {
      this.key = key;
      this.val = val;
      if (this.key === "用户名") {
        return;
      } else {
        console.log(this.val, "1");
        this.$refs.messageupdata.show();
      }
    },
    sureout() {
      this.dislogin();
      this.$router.push("/");
    },
    notsureout() {},
    back() {
      this.$router.push("/");
    },
    dislogins() {
      this.$refs.confirm.show();
    },
    changeimg() {
      this.imgchage = true;
      console.log("修改前的动画");
      setTimeout(() => {
        this.$refs.imgupdata.show();
      }, 500);
    },
    chooseback() {
      this.imgchage = false;
    },
    ...mapActions(["dislogin"])
  },
  computed: {
    ...mapGetters(["login", "usernum", "username", "userwords", "userimg","likelist","userHistory"]),
    imgsrc() {
      return this.userimg === "default"
        ? "http://123.207.138.78:8882"
        : this.userimg;
    }
  },
  components: {
    imgupdata,
    messagebox,
    confirm,
    messageupdata,
    scroll,
    xmusiclist
  }
};
</script>
<style>
.showp{
  padding: 10px;
}
.scroll-wraper {
  height: 100%;
  overflow: hidden;
}
.personimg {
  border-radius: 50%;
  border: 3px solid #fff;
}
.usermessage {
  /* padding-top: 50px; */
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.scroll-bottom1{
  height: 42px;
}
.scroll-bottom2{
  height: 102px;
}
.personinf {
  position: fixed;
  top: 0;
  width: 100%;
  bottom: 0;
  background-color: #fff;
}
.login {
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: #fff;
  z-index: 200;
}
.loginback {
  position: absolute;
  margin: 6px 0 0 6px;
}
.dislogin {
  position: absolute;
  right: 0;
  margin: 6px 6px 0 0;
}
.dislogin-icon {
  display: inline-block;
  height: 30px;
  width: 30px;
  background-image: url(../common/image/dislogin.svg);
}
.back-icon {
  display: inline-block;
  height: 30px;
  width: 30px;
  background-image: url(../common/image/loginback.svg);
}
.logintitle {
  display: flex;
  justify-content: center;
  align-content: center;
  border-bottom: 1px solid #00000026;
  border-top: 1px solid #00000026;
  background-color: #f9f9f9;
}
.title_p {
  font-size: 18px;
  height: 40px;
  line-height: 40px;
}
.userbox {
  width: 100%;
  height: 30vh;
  /* padding-top: 50%; */
  background-color: #31c27c;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.userimg {
  width: 126px;
  height:126px;
  border-radius: 50%;
  background-color: #fff;
}
.useename {
  position: absolute;
  bottom: 0;
  /* display: inline-block; */
  font-size: 18px;
  color: #fff;
}
.imgsvg {
  height: 120px;
  width: 120px;
}
.imgchage {
  animation: imgmove 0.8s ease;
}
@keyframes imgmove {
  from {
  }
  to {
    transform: scale(3.6);
  }
}
</style>
