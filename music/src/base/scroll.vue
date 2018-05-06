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
        click: this.click
			}); 
	    console.log('scroll初始化成功');
      if (this.listenScroll) {
          console.log('监听scroll');
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos)
          })
        }
		},
		refresh(){
			this.scroll && this.scroll.refresh();
    },
    scrollToElement(){
      this.scroll&&this.scroll.scrollToElement.apply(this.scroll,arguments);
    }
	},
	watch: {
      data () {
       this.$nextTick(()=>{
				 this.refresh();
			 })
      }
    }
};
</script>
<style>

</style>
