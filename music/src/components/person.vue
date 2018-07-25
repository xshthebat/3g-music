<template>
    <div class="personinf">
          <!-- 顶部 -->
        <div class="loginback" @click="back"><i class="back-icon"></i></div>
        <div class="dislogin"><i class="dislogin-icon" @click="dislogins"></i></div>
        <div class="logintitle"><p class="title_p">{{title}}</p></div>
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
        </div>
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
export default {
  data() {
    return {
      title: "个人信息",
      imgchage: false,
      imgbig: false,
      key:null,
      val:''
    };
  },
  activated() {
    if (!this.login) {
      this.$router.push("/");
    }
  },
  methods: {
    change({key,val}){
       this.key = key;
       this.val = val;
       if(this.key === '用户名'){
           return;
       } else{
           console.log(this.val,'1');
          this.$refs.messageupdata.show();
       }

    },
    sureout() {
        this.dislogin();
        this.$router.push('/');
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
    ...mapGetters(["login", "usernum", "username", "userwords", "userimg"]),
    imgsrc() {
      return this.userimg === "default"
        ? "http://localhost:8882"
        : this.userimg;
    }
  },
  components: {
    imgupdata,
    messagebox,
    confirm,
    messageupdata
  }
};
</script>
<style>
.personimg {
  border-radius: 50%;
  border: 3px solid #fff;
}
/* .messageboxs {
  margin-left: 20px;
} */
.usermessage {
  /* padding-top: 50px; */
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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
  height: 0;
  padding-top: 50%;
  background-color: #31c27c;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.userimg {
  position: absolute;
  top: 40%;
  margin-top: -60px;
  width: 120px;
  height: 120px;
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
