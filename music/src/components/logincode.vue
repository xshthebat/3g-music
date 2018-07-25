<template>
    <div class="checkcode">
        <!-- 顶部 -->
        <div class="loginback" @click="back"><i class="back-icon"></i></div>
        <div class="logintitle"><p class="title_p">{{title}}</p></div>
        <!-- 中部 -->
        <div class="login-middle">
            <div class="login-box">
                  <inputbox placeholder="请输入7位邮箱验证码" :maxlenth="7" @query="getcodes" v-show="vercode"></inputbox>
                  <password placeholder="请输入密码"  @query="getpassword" :show="false"  v-show="!vercode"></password>
                  <vercodes v-show="!vercode" :vercodeplaceholder="`请输入验证码`" ref="vercodes" @vercodes="getinputvercode" @errs="vercodeerrr" :time="60"></vercodes>
                  <div class="changemode" @click="change">{{loginmode}}</div>
            </div>
            <buttombox :button="`登陆`" :disabled="disabled" @submit="sumbit"></buttombox>
            <div class="message">
              <p class="messagetext" v-show="text">{{text}}</p>
            </div>
        </div>
        <confirm :text="confirmtext" ref="confirm" @sure="loginsuccess" ></confirm>
        <div v-show="submitit" class="loading-wrap">
          <loading :title="`正在登陆中`"></loading>
        </div>  
    </div>
</template>
<script>
import { login } from "../api/lgoin.js";
import confirm from "../base/confirm";
import inputbox from "../base/inputbox";
import buttombox from "../base/buttombox";
import loading from "../base/loading";
import password from "../base/password";
import vercodes from "../base/vercodes";
import {signupMode} from "../common/js/config.js";
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      title: "邮箱验证码验证",
      codes: "",
      password: "",
      disabled: true,
      text: "",
      submitit: false,
      confirmtext: "",
      vercode: true,
      vercodes: ""
    };
  },
  activated() {
    this.submitit = false;
    if (!this.signup) {
      this.$router.push("/");
    }
    else if(this.signupflag!==signupMode.checklogin){
       this.setsignuoflag(signupMode.nosignup);
      this.$router.push("/login");
    }
    else{
      this.setsignuoflag(signupMode.checklogin);
      //保持本页面状态
    }
    if(this.login){
      this.$router.push("/person");
    }
  },
  computed: {
    loginmode() {
      return this.vercode ? "密码登陆" : "验证码登陆";
    },
     ...mapGetters(["signup","signupflag","login"])
  },
  methods: {
    getinputvercode(newval) {
      this.vercodes = newval;
    },
     ...mapMutations({
      setsignuoflag:'SET_SIGNUPFLAG'
    }),
    back() {
      this.setsignuoflag(signupMode.nosignup);
      this.$router.back("/login");
    },
    getcodes(newval) {
      this.codes = newval;
    },
    getpassword(newval) {
      this.password = newval;
    },
    vercodeerrr(err) {
      //这里是验证码获取失败
      console.log(err);
    },
    sumbit() {
      if (this.codes.length != 7 && this.vercode) {
        this.confirmtext = "验证码不足7位";
        this.$refs.confirm.show();
        return;
      }
      this.submitit = true;
      if (this.vercode) {
        login("codes", this.codes).then(res => {
          this.submitit = false;
          if (res.err) {
            this.confirmtext = res.errtype;
            console.log("vuex");
            this.$refs.confirm.show();
          } else {
            this.confirmtext = `登陆成功`;
            //处理数据加入到vuex中
            console.log("vuex");
            this.logins(res.data);
            this.$refs.confirm.show();
          }
        });
      } else {
        login("password", this.password, this.vercodes).then(res => {
          this.submitit = false;
          if (res.err) {
            this.confirmtext = res.errtype;
            this.$refs.confirm.show();
          } else {
            this.confirmtext = `登陆成功`;
             console.log("vuex");
            this.logins(res.data);
            this.$refs.confirm.show();
          }
        });
      }
    },
    loginsuccess() {
      this.$router.push('/person');
    },
    change() {
      this.vercode = !this.vercode;
      this.disabled = true;
      if (!this.vercode) {
        this.$refs.vercodes.getvercodes();
      }
      if (this.vercode && this.codes.length === 7) {
        this.disabled = false;
        this.text = "";
      }
      if (!this.vercode && this.password.length >= 6) {
        this.disabled = false;
        this.text = "";
      }
    },
    ...mapActions(["logins"])
  },
  watch: {
    codes(newval) {
      if (newval.length === 7 && newval) {
        this.disabled = false;
        this.text = "";
      } else {
        this.disabled = true;
        this.text = "邮箱验证码不足7位";
      }
    },
    password(newval) {
      if (!newval || this.password.length < 6) {
        this.disabled = true;
        this.text = "密码不足6位";
      } else {
        if (!this.vercode) {
          this.disabled = false;
          this.text = "";
        }
      }
    }
  },
  components: {
    confirm,
    inputbox,
    buttombox,
    loading,
    password,
    vercodes
  }
};
</script>
<style>
.checkcode {
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: #fff;
  z-index: 200;
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
.changemode {
  float: right;
  font-size: 16px;
  color: red;
}
</style>
