<template>
    <transition name="messageupdata">
        <div class="messageupdata" v-show="flag">
            <div class="loginback" @click="back" ref="back"><i class="back-icon"></i></div>
            <div class="logintitle"><p class="title_p">{{`${messagename}修改`}}</p></div>
            <div class="text-wrap">
                <textarea  type="textarea" class="textarea" v-model="query"></textarea>
                <buttombox :disabled="disabled" :button="`修改`" class="updatabuttom" @submit="submit"></buttombox>
            </div>
            <confirm :text="text" ref="confirm" @sure="sure" @cancel="sure"></confirm>
        </div>    
      </transition>
</template>
<script>
import confirm from "../base/confirm";
import buttombox from "../base/buttombox";
import {updatamessage} from "../api/lgoin.js";
import {mapActions} from "vuex";
export default {
  data() {
    return {
      flag: false,
      disabled: true,
      query: "",
      text:''
    };
  },
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    messagename: {
      type: String,
      default: "信息"
    }
  },
  methods: {
    show() {
      this.$nextTick(() => {
        this.query = `${this.placeholder}`;
        console.log(this.query, this.placeholder, "2");
        this.flag = true;
      });
    },
    sure(){
      if(this.text === '修改成功'){
        this.checklogins();
      }
      this.back();
    },
    back() {
      this.flag = false;
      this.$emit("back");
    },
    _pattern() {
      let pattern = null;
      if (this.messagename === "昵称") {
        return (pattern = /^[A-Za-z0-9_@.\u4e00-\u9fa5]{5,20}$/);
        // //用户名正则，4到16位（字母，数字，下划线，减号）
      }
      if (this.messagename === "个性签名") {
        return (pattern = /^[A-Za-z0-9_@.\u4e00-\u9fa5]{0,50}$/);
      }
    },
    submit(){
      if(this.messagename === "昵称"){
        updatamessage('username',this.query).then(res=>{
          if(!res.err){
            this.text = '修改成功';
          } else{
            this.text = res.errtype;
          }
          this.$refs.confirm.show();
        });
      } 
      if(this.messagename ==="个性签名"){
       updatamessage('userword',this.query).then(res=>{
          if(!res.err){
            this.text = '修改成功';
          } else{
            this.text = res.errtype;
          }
          this.$refs.confirm.show();
       });
      }
    },
    ...mapActions(["checklogins"])
  },
  watch: {
    query(newval) {
      this.disabled = !this._pattern().test(newval);
    }
  },
  components: {
    buttombox,
    confirm
  }
};
</script>
<style>
.updatabuttom {
  width: 50%;
}
.text-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.textarea {
  margin: 10px 0px;
  width: 80%;
  height: 20vh;
  font-size: 16px;
  overflow: auto;
  background-attachment: fixed;
  background-repeat: no-repeat;
  /* border :solid #FFFFFF; */
  outline: none;
}
.messageupdata {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  background-color: #fff;
}
.messageupdata-enter, .messageupdata-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(100%);
  opacity: 0;
}
.messageupdata-enter-active,
.messageupdata-leave-active {
  transition: all 0.3s ease;
}
</style>
