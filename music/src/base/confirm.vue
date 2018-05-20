<template>
    <transition name="confirm-fade" @enter="enter">
        <div class="confirm" v-show="showFlag" @click.stop>
          <div class="confirm-wrapper">
            <div class="confirm-content" :class="entering">
                <p class="confirm-text">{{ text }}</p>

                <div class="confirm-operate">
                    <div class="operate-btn left" @click="confirm">{{ confirmBtnText }}</div>
                    <div class="operate-btn"  @click="cancel">{{ cancelBtnText }}</div>
                </div>
            </div>
          </div>
        </div>
    </transition>
</template>
<script>
export default {
  data() {
    return {
      showFlag: false,
      center:false
    };
  },
  props: {
    text: {
      type: String,
      default: "确认清空播放队列吗?"
    },
    cancelBtnText: {
      type: String,
      default: "取消"
    },
    confirmBtnText: {
      type: String,
      default: "确定"
    }
  },
  methods: {
    show() {
      this.showFlag = true;
    },
    enter(){
        this.center = true;
        console.log(this.entering);
    },
    back(){
        this.showFlag = false;
        this.center = false;
    },
    confirm(){
      this.$emit('sure');
      this.back();
    },
    cancel(){
      this.$emit('canel');
      this.back();
    }
  },
  computed:{
      entering(){
          return this.center ? 'confirm-content-enter':'';
      }
  }
};
</script>
<style>
.confirm {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 998;
  background-color: rgba(0, 0, 0, 0.35);
}
.confirm-wrapper{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
}
.confirm-fade-enter-active {
  animation: confirm-fadein 0.3s;
}
.confirm-fade-leave-active{
    animation:confirm-fadeout 0.3s;
}
.confirm-content-enter{
  animation:confirm-zoom 0.3s;
}
.confirm-content{
    width: 270px;
    border-top:2px solid red;
    background-color: #fff;
}
.confirm-text{
    width: 100%;
    height: 65px;
    text-align: center;
    line-height: 65px;
    font-size: 15px;
    border-bottom: 1px solid #00000017;
}
.confirm-operate{
    display: flex;
    position: relative;
}
.operate-btn{
     width: 50%;
     height: 30px;
     line-height: 30px;
     font-size: 15px;
     text-align: center;
}
.left{
    border-right: 1px solid #00000017;
    color: red;
}
@keyframes confirm-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes confirm-fadeout {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes confirm-zoom {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
