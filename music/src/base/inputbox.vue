<template>
    <div class="input-box">
        <input :type="inputype" class="search-input" v-model="query" :placeholder="placeholder" :maxlength="maxlenth">
        <i class="login-dismiss" v-show="query" @click="clearQuery"></i>
        <div class="passwordeye" v-if="ispassword" @touchstart="showit" @touchend="dishow">
            <i :class="showicon" v-show="query"></i>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      query: "",
      show: false
    };
  },
  created(){
      console.log(this);
  },
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    maxlenth: {
      type: Number,
      default: 320
    },
    match: {
      type: RegExp,
      default: null
    },
    ispassword: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    clearQuery() {
      this.query = "";
    },
    showit(){
        this.show = true;
    },
    dishow(){
        this.show = false;
    }
  },
  computed: {
     inputype(){
      if (!this.ispassword) {
        return "text";
      } else {
        return this.show ? "text" : "password";
      }
    },
    showicon() {
      return this.show ? "passshow" : "passdishow";
    }
  },
  watch: {
    query(newval) {
      this.$emit("match", newval.match(this.match));
      this.$emit("query", newval);
    }
  }
};
</script>
<style>
.input-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  padding-bottom: 6px;
  position: relative;
  justify-content: space-between;
  margin-bottom: 10px;
}
.input-box:after {
  content: "  ";
  position: absolute;
  left: 0;
  bottom: 0px;
  width: 100%;
  height: 1px;
  background-color: red;
  /* 如果不用 background-color, 使用 border-top:1px solid #f00; 效果是一样的*/
  transform: scaleY(0.5);
}
.search-input {
  margin: 0 5px;
  line-height: 20px;
  border: 0;
  outline: none;
}
.login-dismiss {
  width: 20px;
  height: 20px;
  background-image: url(../common/image/icon-dismiss.svg);
}
.passwordeye {
}
.passdishow {
  display: block;
  height: 20px;
  width: 20px;
  background-image: url(../common/image/passdisshow.svg)
}
.passshow {
  display: block;
  height: 20px;
  width: 20px;
background-image: url(../common/image/passshow.svg)
}
</style>
