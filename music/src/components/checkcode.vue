<template>
    <div class="checkcode">
        <!-- 顶部 -->
        <div class="loginback" @click="back"><i class="back-icon"></i></div>
        <div class="logintitle"><p class="title_p">{{title}}</p></div>
        <!-- 中部 -->
        <div class="login-middle">
            <div class="login-box">
                  <inputbox placeholder="请输入7位邮箱验证码" :maxlenth="7" @query="getcodes"></inputbox>
                  <password placeholder="请输入密码,至少6位"  @query="getpassword" :show="true"></password>
                  <password placeholder="请再次输入密码"  @query="getpasswordaga"></password>
            </div>
            <buttombox :button="`确认注册`" :disabled="disabled" @submit="sumbit"></buttombox>
            <div class="message">
              <p class="messagetext" v-show="text">{{text}}</p>
            </div>
        </div>
        <confirm :text="confirmtext" ref="confirm" @sure="addsuccess" @canel="notsave"></confirm>
        <div v-show="submitit" class="loading-wrap">
          <loading :title="`正在注册中`"></loading>
        </div>  
    </div>
</template>
<script>
import { checkemailcodes, login } from "../api/lgoin.js";
import confirm from "../base/confirm";
import inputbox from "../base/inputbox";
import buttombox from "../base/buttombox";
import loading from "../base/loading";
import password from "../base/password";
import { signupMode } from "../common/js/config.js";
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      title: "邮箱验证码验证",
      codes: "",
      password: "",
      passwordagin: "",
      disabled: true,
      text: "",
      submitit: false,
      confirmtext: ""
    };
  },
  activated() {
    if (!this.signup) {
      this.$router.push("/");
    } else if (this.signupflag !== signupMode.postemail) {
      this.setsignuoflag(signupMode.nosignup);
      this.$router.push("/login");
    } else {
      this.setsignuoflag(signupMode.postemail);
      //保持本页面状态
    }
    if (this.login) {
      this.$router.push("/person");
    }
  },
  methods: {
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
    getpasswordaga(newval) {
      this.passwordagin = newval;
    },
    sumbit() {
      if (this.codes.length != 7) {
        this.confirmtext = "验证码不足7位";
        this.$refs.confirm.show();
        return;
      }
      // console.log(this.userHistory,this.likelist);
      // return;
      this.confirmtext = "是否同步本地信息";
      this.$refs.confirm.show();
      //这里提示是否保存本地历史
    },
    addsuccess() {
      if (this.confirmtext === "是否同步本地信息") {
        console.log("上传本地，本地不清楚");
        console.log(this.userHistory,this.likelist);
        this.submitit = true;
        checkemailcodes(this.codes, this.password).then(res => {
          this.submitit = false;
          console.log(res);
          if (res.err) {
            this.confirmtext = res.errtype;
            this.$refs.confirm.show();
          } else {
            this.confirmtext = res.data;
            this.checklogins();
            this.$refs.confirm.show();
          }
        });
        return;
      }
      this.$nextTick(() => {
        this.$router.push("/person");
        //要是完成去除本组件;
        this.$destroy();
      });
    },
    notsave() {
      console.log('haha')
      if (this.confirmtext === "是否同步本地信息") {
        this.submitit = true;
        console.log("不同步,本地清除");
        checkemailcodes(this.codes, this.password).then(res => {
          this.submitit = false;
          console.log(res);
          if (res.err) {
            this.confirmtext = res.errtype;
            this.$refs.confirm.show();
          } else {
            this.confirmtext = res.data;
            this.checklogins();
            this.$refs.confirm.show();
          }
        });
        return;
      }
    },
    ...mapMutations({
      setsignuoflag: "SET_SIGNUPFLAG"
    }),
    ...mapActions(["checklogins"])
  },
  computed: {
    ...mapGetters(["signup", "signupflag", "login", "userHistory", "likelist"])
  },
  watch: {
    codes(newval) {
      console.log(newval);
    },
    passwordagin(newval) {
      if (
        newval &&
        this.password === this.passwordagin &&
        this.password.length >= 6
      ) {
        this.text = "";
        this.disabled = false;
      } else {
        this.disabled = true;
        this.text = "二次密码与原密码不符";
      }
    },
    password(newval) {
      if (this.password.length < 6 && newval) {
        this.disabled = true;
        this.text = "密码不足6位";
      } else {
        this.text = "";
      }
    }
  },
  components: {
    confirm,
    inputbox,
    buttombox,
    loading,
    password
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
</style>
