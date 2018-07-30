<template>
  <div class="m-header">
    <div class="person-wrapper">
    <div class="person" ref="login" @click.prevent="logins"></div>
    </div>
    <div class="icon"></div>
    <h1 class="text">3G music</h1>
    <confirm :text='`你在其他设备登陆`' ref="confirm" @sure="sure"></confirm>
    <loading :title="`登陆数据验证中`" class="m-loading" v-show="loading"></loading>
  </div>
</template>
<script>
import { signupMode } from "../common/js/config.js";
import { mapGetters, mapMutations, mapActions } from "vuex";
import confirm from "../base/confirm";
import loading from "../base/loading";
export default {
  data() {
    return {
      show: false,
      loading:false
    };
  },
  methods: {
    ...mapMutations({
      setsignup: "SET_SIGNUP",
      setlogin: "SET_LOGIN"
    }),
    sure() {
      this.$router.push("/");
    },
    logins() {
      this.loading = true;
      this.checklogins().then(() => {
        this.loading = false;
        if (!this.login) {
          //这里触发 signuo 为true;
          this.setsignup(true);
          //判断注册状态
          if (this.signupflag === signupMode.postemail) {
            this.$router.push("/login/checkcode");
          } else if (this.signupflag === signupMode.checklogin) {
            this.$router.push("/login/logincode");
          } else {
            this.$router.push("/login");
            this.setsignuoflag(signupMode.nosignup);
          }
        } else {
          this.$router.push("/person");
        }
      });
    },
    ...mapMutations({
      setsignuoflag: "SET_SIGNUPFLAG"
    }),
    ...mapActions(["dislogin", "checklogins"])
  },
  watch: {
    login(newval) {
      let self = this;
      // let source = null;
      // console.log(window)
      if (newval) {
        if (window.source) {
          source.close();
        }
        window.source = new EventSource("http://123.207.138.78:8881/alive", {
          withCredentials: true
        });
        window.source.addEventListener("error", function(e) {
          // console.log(e);
        });
        console.log("登陆成功 开始轮询");
        window.source.addEventListener(
          "message",
          function(e) {
            // console.log(e.data);
            if (e.data === "losttime") {
              self.$refs.confirm.show();
              self.setlogin(false);
              source.close();
            }
          },
          false
        );
      } else {
        console.log("未登陆");
        console.log(source);
        if (window.source) {
          console.log("链接断开");
          window.source.close();
        }
        // self.dislogin();
        this.$router.push("/");
      }
    }
  },
  computed: {
    ...mapGetters(["login", "signupflag", "login"])
  },
  components: {
    confirm,
    loading
  }
};
</script>
<style>
.m-header {
  height: 44px;
  position: relative;
  flex-direction: row;
  text-align: center;
  background-color: #31c27c;
  display: flex;
  color: #fff;
  justify-content: center;
  align-items: center;
}
.person {
  height: 32px;
  width: 32px;
  display: block;
  flex: 1;
  position: absolute;
  background-image: url("./../common/image/login.svg");
  left: 0;
}
.icon {
  display: inline-block;
  height: 32px;
  width: 32px;
  background-image: url("./../common/image/icon.png");
  margin-right: 9px;
}
.text {
  line-height: 44px;
  font-size: 18px;
  margin-right: 32px;
}
.sad {
  z-index: 999;
  color: black;
}
.m-loading{
  position: absolute;
  top: 30%;
}
.person-wrapper{
  width: 32px;
    height: 32px;
}
</style>
