<template>
  <div class="slider" ref="slide">
      <div class="slider-group" ref="slidegroup">
          <slot ref="main">没有内容才显示</slot>
      </div>
      <div class="dots">
      <span v-for="(item, index) in dots" class="dot"
            :class="{active: currentPageIndex === index }">
      </span>
    </div>
  </div>
</template>
<script>
import BScroll from "better-scroll";
import { addClass } from "../common/js/dom";
import { commonParams } from "../api/config";
export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    },
    showDot: {
      type: Boolean,
      default: true
    },
    click: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 0.3
    },
    speed: {
      type: Number,
      default: 400
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    };
  },
  mounted() {
    console.log(this.$refs);
    // debugger;
    this.update();
    window.addEventListener("resize", () => {
      if (!this.slide || !this.slide.enabled) {
        return;
      }
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        if (this.slide.isInTransition) {
          this._onScrollEnd();
        } else {
          if (this.autoPlay) {
            this._play();
          }
        }
        this.refresh();
      }, 60);
    });
  },
  activated() {
    if (!this.slide) {
      return;
    }
    this.slide.enable();
    let pageIndex = this.slide.getCurrentPage().pageX;
    this.slide.goToPage(pageIndex, 0, 0);
    this.currentPageIndex = pageIndex;
    if (this.autoPlay) {
      this._play();
    }
  },
  deactivated() {
    this.slide.disable();
    clearTimeout(this.timer);
  },
  beforeDestroy() {
    this.slide.disable();
    clearTimeout(this.timer);
  },
  methods: {
    update() {
      if (this.slide) {
        this.slide.destroy();
      }
      this.$nextTick(() => {
        this.init();
      })
      // setTimeout(()=>{
      //   this.init();
      // },20);
    },
    refresh() {
      this._setSlideWidth(true);
      this.slide.refresh();
    },
    prev() {
      this.slide.prev();
    },
    next() {
      this.slide.next();
    },
    init() {
      clearTimeout(this.timer);
      this.currentPageIndex = 0;
      this._setSlideWidth();
      if (this.showDot) {
        this._initDots();
      }
      this._initSlide();
      if (this.autoPlay) {
        this._play();
      }
    },
    _setSlideWidth(isResize) {
      this.children = this.$refs.slidegroup.children;
      let width = 0;
      let slideWidth = this.$refs.slide.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, "slider-item");
        child.style.width = slideWidth + "px";
        width += slideWidth;
      }
      if (this.loop && !isResize) {
        width += 2 * slideWidth;
      }
      this.$refs.slidegroup.style.width = width + "px";
    },
    _initSlide() {
      //  debugger;
      this.slide = new BScroll(this.$refs.slide, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: this.threshold,
          speed: this.speed
        },
        bounce: false,
        stopPropagation: true,
        click: this.click
      });
      console.log(this.slide);
      console.log(this.slide.pages.length);
      if (this.slide.pages.length == 0 && this.loop) {
        console.log("初始化失败");
      }
      this.slide.on("scrollEnd", this._onScrollEnd);
      this.slide.on("touchEnd", () => {
        if (this.autoPlay) {
          this._play();
        }
      });
      this.slide.on("beforeScrollStart", () => {
        if (this.autoPlay) {
          clearTimeout(this.timer);
        }
      });
    },
    _onScrollEnd() {
      let pageIndex = this.slide.getCurrentPage().pageX;
      this.currentPageIndex = pageIndex;
      if (this.autoPlay) {
        this._play();
      }
    },
    _initDots() {
      this.dots = new Array(this.children.length);
    },
    _play() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.slide.next();
      }, this.interval);
    }
  },
  watch: {
    loop() {
      this.update();
    },
    autoPlay() {
      this.update();
    },
    speed() {
      this.update();
    },
    threshold() {
      this.update();
    }
  }
};
</script>
<style>
.slider-group {
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}
.slider-item {
  float: left;
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
}
.slider-item a {
  display: block;
  width: 100%;
  overflow: hidden;
  text-decoration: none;
}
.slider-item img {
  display: block;
  width: 100%;
}
.dots {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 12px;
  text-align: center;
  font-size: 0;
}
.dot {
  display: inline-block;
  margin: 0 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
}
.active {
  width: 20px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.8);
}
</style>
