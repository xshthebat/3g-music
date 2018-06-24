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
        <confirm :text="confirmtext" ref="confirm" @sure="addsuccess" ></confirm>
        <div v-show="submitit" class="loading-wrap">
          <loading :title="`正在注册中`"></loading>
        </div>  
    </div>
</template>
<script>
import { checkemailcodes } from "../api/lgoin.js";
import confirm from "../base/confirm";
import inputbox from "../base/inputbox";
import buttombox from "../base/buttombox";
import loading from "../base/loading";
import password from "../base/password";
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
  methods: {
    back() {
      this.$router.back('/login');
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
      this.submitit = true;
      checkemailcodes(this.codes, this.password).then(res => {
        this.submitit = false;
        console.log(res);
        if (res.err) {
          this.confirmtext = res.errtype;
          this.$refs.confirm.show();
        } else {
          this.confirmtext = res.data;
          this.$refs.confirm.show();
        }
        // this.submitit = false;
        // this.$router.push('/login/checkcode/personinformation');
        // this.$nextTick(()=>{
        //     //要是注册完成去除本组件;
        //      this.$destroy();
        // })
      });
    },
    addsuccess() {
      if (this.confirmtext == "注册成功") {
        this.$router.push("/login/checkcode/personinformation");
        this.$nextTick(() => {
          //要是注册完成去除本组件;
          this.$destroy();
        });
      }
      if(this.confirmtext=="请勿重复注册"){
          this.$router.push("/login");
            this.$nextTick(() => {
          //要是注册完成去除本组件;
          this.$destroy();
        });
      }
    }
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
</style>
