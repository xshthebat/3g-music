<template>
    <div class="login">
        <!-- 顶部 -->
        <div class="loginback" @click="back"><i class="back-icon"></i></div>
        <div class="logintitle"><p class="title_p">{{title}}</p></div>
        <!-- 中部 -->
        <div class="login-middle">
            <div class="login-box">
                  <inputbox :placeholder="placeholder" :maxlenth="320" :match="/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/" @query="getinputquery" @match="emailmatch"></inputbox>
                  <vercodes :vercodeplaceholder="vercodeplaceholder" ref="vercodes" @vercodes="getinputvercode" @errs="vercodeerrr"></vercodes>
            </div>
            <!-- <div class="login-button">
                <button class="submit-login" :class="{btndisabled:disabled}" @click="btnclick">{{button}}</button>
            </div> -->
            <buttombox :disabled="disabled" :button="`获取邮箱验证码`" @submit="sumbit"></buttombox>
            <div class="message">
              <p class="messagetext" v-show="text">{{text}}</p>
            </div>
        </div>
        <confirm :text="confirmtext" ref="confirm" @sure="confirm" @canel="confirm"></confirm>
        <div v-show="submitit" class="loading-wrap">
          <loading :title="`验证码获取中`"></loading>
        </div>
    </div>
</template>
<script>
import { getvercode } from "../api/getvercode.js";
import vercodes from "../base/vercodes";
import { getemailcodes } from "../api/lgoin.js";
import confirm from "../base/confirm";
import inputbox from "../base/inputbox";
import buttombox from "../base/buttombox";
import loading from "../base/loading";
export default {
  data() {
    return {
      ifphone: false,
      title: "邮箱 注册 / 登陆",
      placeholder: "请输入邮箱",
      vercodeplaceholder: "请输入图片验证码",
      query: "",
      vercode: "",
      email: "",
      disabled: true,
      vercodesvg: null,
      text: null,
      confirmtext: "",
      submitit: false,
      time: null
    };
  },
  methods: {
    vercodeerrr(err) {
      //这里是验证码获取失败
      console.log(err);
    },
    back() {
      this.$router.back(-1);
    },
    getinputvercode(newval) {
      this.vercode = newval;
    },
    getinputquery(newval) {
      this.query = newval;
    },
    emailmatch(newval) {
      this.email = newval ? newval[0] : "";
    },
    sumbit() {
      if (this.vercode.length !== 4) {
        this.confirmtext = "请输入完整验证码";
        this.$refs.confirm.show();
        this.$refs.vercodes.getvercodes();
      } else {
        this.submitit = true;
        console.log("提交表单", this.email, this.vercode);
        getemailcodes(this.email, this.vercode).then(res => {
          this.submitit = false;
          console.log(res);
          if (res.err) {
            this.confirmtext = res.errtype;
            this.$refs.confirm.show();
          } else {
            this.confirmtext = res.data;
            this.$refs.confirm.show();
            let self = this;
            this.time = setTimeout(()=>{
              self.time = null;
            },6000);
          }
          this.$refs.vercodes.getvercodes();
        });
      }
    },
    confirm() {
      console.log(this.confirmtext);
      if (this.confirmtext === "验证发送成功请查看邮箱") {
        this.$router.push("/login/checkcode");
      }
    }
  },
  activated() {
    console.log(this.time);
  },
  watch: {
    vercode(newval) {
      // console.log(newval);
    },
    email(newval) {
      this.disabled = true;
      if (newval) {
        this.disabled = false;
        if (!this.$refs.vercodes.vercodesvg) {
          this.$refs.vercodes.getvercodes();
        }
      }
    },
    submitit(newval) {
      if (newval) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    },
    time(newval){
      if(newval){
        console.log(this.time);
        this.$refs.vercodes.show = false;
      } else{
        this.$refs.vercodes.show = true;
      }
    }
  },
  components: {
    confirm,
    vercodes,
    inputbox,
    buttombox,
    loading
  }
};
</script>
<style>
.messagetext {
  display: inline-block;
  font-size: 18px;
  color: red;
}
.message {
  height: 30vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
.login-middle {
  height: 300px;
  padding-top: 100px;
}
.login-box {
  padding: 0 50px;
}
.loading-wrap {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.15);
}
</style>
