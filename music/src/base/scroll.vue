<template>
   <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script>
import BScroll from "better-scroll";
export default {
  props: {
    probeType: {
      type: Number, //类型
      default: 1
    },
    click: {
      type: Boolean, //是否开启点击
      default: true
    },
    data: {
      type: Array, //数据
      default: null
    },
    listenScroll: {
      type: Boolean, //是否监听滚动
      default: false
    },
    // 延迟刷新
    refreshDelay: {
      type: Number,
      default: 20
    },
    pullup: {
      type: Boolean,
      default: false
    }, //上拉刷新
    // 滚动前是否触发事件，如：滚动前让输入框失去焦点，避免滚动搜索结果时移动端键盘遮挡
    beforeScroll: {
      type: Boolean,
      default: false
    },
    scrollX:{
      type:Boolean,
      default:false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._initScroll();
    });
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
       scrollX:this.scrollX
      });
      // console.log(this.scroll);
      // console.log('scroll初始化成功');
      if (this.listenScroll) {
        // console.log('监听scroll');
        this.scroll.on("scroll", pos => {
          this.$emit("scroll", pos);
        });
      }
      if (this.pullup) {
        // console.log('监听pullup')
        this.scroll.on("scrollEnd", () => {
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            //滑到底部
            this.$emit("scrollToEnd");
          }
        });
      }
      if (this.beforeScroll) {
        this.scroll.on("beforeScrollStart", () => {
          this.$emit("beforeScroll");
        });
      }
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    }
  },
  watch: {
    data() {
      this.$nextTick(() => {
        this.refresh();
      });
    }
  }
};
</script>
<style>
</style>
