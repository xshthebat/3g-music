<template>
<transition name="updata">
    <div class="imgupdata" v-show="flag">
        <div class="loginback" @click="back" ref="back"><i class="back-icon"></i></div>
        <div class="logintitle"><p class="title_p">{{title}}</p></div>
        <div class="choose" >
             <div class="imgprev"><img :src="imgsrc" ref='imgview' class="imgview"></div>
                <canvas id="canvas" ref="canvas"></canvas>
                <canvas id="canvas" ref="canvas2"></canvas>
                <div  class="choosebox" >
                    <buttombox :disabled="!updataimg" :button="`上传图片`"  class="bottomboxs" @submit="submit"></buttombox>
                    <buttombox :disabled="updataimg" :button="`选择图片`"  class="bottomboxs" ></buttombox>                    
                    <label for="file_input" class="label" >
                        <input ref="input" type="file" v-show="!flag" id="file_input" @change="chooseimg" :disabled="disabled"/>
                    </label>
                </div>
        </div>
        <div class="imgchoose" v-show="change" ref="bimg" @touchstart="touchstart" @touchmove="touchmove" @mousewheel="mousewheel">
          <div class="tbox"></div>
        </div>
        <div class="operate" v-show="change">
           <buttombox :disabled="false" :button="`确定`"  class="operatebottom" @submit="choose"></buttombox>
           <buttombox :disabled="false" :button="`取消`"  class="operatebottom" @submit="nochange"></buttombox>
        </div>
    </div>
</transition>
</template>
<script>
import saveimg from "../api/saveimg.js";
import buttombox from "../base/buttombox";
import {mapMutations, mapActions} from "vuex";
export default {
  props:{
    imgsrc:{
      type:String,
      default:''
    }
  },
  activated(){
    console.log(this.imgsrc);
  },
  data() {
    return {
      flag: false,
      title: "选择图片",
      change: false,
      left: 0,
      top: 0,
      height: 120,
      width: 120,
      canmove: true,
      nativeheight: 0,
      nativewidth: 0,
      img: null,
      type: "",
      updataimg: false
    };
  },
  computed: {
    updatabuttom() {
      return this.updataimg ? "确定上传" : "选择图片";
    },
    disabled() {
      return this.updataimg ? "disabled" : null;
    },
    none() {
      return this.updataimg ? "none" : null;
    }
  },
  activated() {
    console.log('haha');
  },
  methods: {
    submit() {
      console.log(this.updataimg);
      if (!this.updataimg) {
        return;
      }
      console.log("上传图片逻辑");

      saveimg(this.blob).then(res => {
        console.log(res.data);
         if(!res.err){
           this.checklogins();
         } 
         this.back();
      });
      // 图片上传 回掉
      //返回

      this.updataimg = false;
    },
    choose() {
      //上传图片
      console.log("上传图片");
      console.log(`图片逻辑大小height:${this.height},width:${this.width}`); //后台先放缩根据实际大小 对应倍数
      console.log(
        `裁剪起始点(${(window.innerWidth - 120) * 0.5 -
          this.left},${(window.innerHeight - 120) * 0.5 - this.top})`
      );
      //回调完成后
      this._cutsmaval().then(img => {
        console.log(img.blob);
        this.blob = img.blob;
        this.updataimg = true;
        this.$refs.imgview.src = img.src;
      });
      this.nochange();
      //等待预览图 改变选择图片为 确认头像  逻辑分离,,,
    },
    _cutsmaval() {
      return new Promise((res, rej) => {
        let ctx = this.$refs.canvas.getContext("2d");
        let maxWidth = 400,
          maxHeight = 400;
        let targetHeight = this.height;
        let targetWidth = this.width;
        if (this.nativewidth > maxWidth || this.nativeheight > maxHeight) {
          //图片过大 按照宽高比限定
          if (this.nativewidth / this.nativeheight > maxWidth / maxHeight) {
            //太宽
            targetWidth = maxWidth;
            targetHeight = Math.round(
              maxWidth * (this.nativeheight / this.nativewidth)
            );
          } else {
            targetHeight = maxHeight;
            targetWidth = Math.round(
              maxHeight * (this.nativewidth / this.nativeheight)
            );
          }
        }
        //按照图示 缩放
        this.$refs.canvas.width = targetWidth;
        this.$refs.canvas.height = targetHeight;
        ctx.clearRect(0, 0, targetWidth, targetHeight);
        //图片压缩
        ctx.drawImage(this.img, 0, 0, targetWidth, targetHeight);
        let url = this.$refs.canvas.toDataURL(this.type, 1); //压缩完毕
        // console.log()
        // res(url);
        let image = new Image();
        image.src = url;
        let self = this;
        image.onload = function() {
          let ctx2 = self.$refs.canvas2.getContext("2d");
          self.$refs.canvas2.width = 120;
          self.$refs.canvas2.height = 120;
          console.log(self.left, self.top);
          ctx2.drawImage(
            image,
            (window.innerWidth - 120) * 0.5 - self.left,
            (window.innerHeight - 120) * 0.5 - self.top,
            120,
            120,
            0,
            0,
            120,
            120
          );
          let src = self.$refs.canvas2.toDataURL(self.type, 1); //压缩完毕
          self.$refs.canvas2.toBlob(blob => {
            res({ src: src, blob: blob });
          });
        };
      });
    },
    nochange() {
      this.change = false;
      //清空内容
      this.$refs.input.value = "";
      console.log("返回");
    },
    touchstart(e) {
      e.preventDefault();
      this.tx = e.touches[0].clientX - this.left;
      this.ty = e.touches[0].clientY - this.top;
    },
    touchmove(e) {
      let w = window.innerWidth;
      let h = window.innerHeight;
      let x = e.touches[0].clientX - this.tx;
      let y = e.touches[0].clientY - this.ty;
      this._imgmove(x, y);

      if (e.touches.lenght == 2) {
        console.log("双指缩放");
      }
    },
    _imgmove(left, top) {
      //照片移动
      if (left > (window.innerWidth - 120) * 0.5) {
        left = (window.innerWidth - 120) * 0.5;
      }
      if (
        left + this.width <
        window.innerWidth - (window.innerWidth - 120) * 0.5
      ) {
        left = window.innerWidth - (window.innerWidth - 120) * 0.5 - this.width;
      }
      if (top > (window.innerHeight - 120) * 0.5) {
        top = (window.innerHeight - 120) * 0.5;
      }
      if (
        top + this.height <
        window.innerHeight - (window.innerHeight - 120) * 0.5
      ) {
        top =
          window.innerHeight - (window.innerHeight - 120) * 0.5 - this.width;
      }
      this.$refs.bimg.style.backgroundPosition = `${left}px ${top}px`;
      this.left = left;
      this.top = top;
    },
    mousewheel(e) {
      let size = e.wheelDelta || e.detail;
      //按原始比方所
      this.power = this.nativeheight / this.nativewidth;
      if (size > 0) {
        this._imgls(1.05 * this.width, 1.05 * this.height);
      } else {
        this._imgls(0.95 * this.width, 0.95 * this.height);
      }
    },
    _imgls(height, width) {
      if (
        width + this.left <
        window.innerWidth - (window.innerWidth - 120) * 0.5
      ) {
        width = window.innerWidth - (window.innerWidth - 120) * 0.5 - this.left;
        height = width * this.power;
      }
      if (
        height + this.top <
        window.innerHeight - (window.innerHeight - 120) * 0.5
      ) {
        height =
          window.innerHeight - (window.innerHeight - 120) * 0.5 - this.top;
        width = height / this.power;
      }
      this.$refs.bimg.style.backgroundSize = `${height}px ${width}px`;
      this.height = height;
      this.width = width;
    },
    show() {
      this.flag = true;
    },
    back() {
      this.flag = false;
      this.$emit("back");
    },
    chooseimg(e) {
      console.log("haha");
      let file = this.$refs.input.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      let self = this;
      console.log(file);
      this.type = file.type;
      reader.onload = function(event) {
        console.log("haha");
        let isrc = null;
        isrc = event.target.result;
        console.log(event.target);
        self.$refs.bimg.style.backgroundImage = `url(${isrc})`;
        //获取图片大小
        let image = new Image();
        image.src = isrc;
        image.onload = function() {
          self.img = image;
          self.nativeheight = image.height > 120 ? image.height : 120;
          self.nativewidth = image.width > 120 ? image.width : 120;

          let w = window.innerWidth;
          let h = window.innerHeight;
          self.height = self.nativeheight;
          self.width = self.nativewidth;
          self.top = (h - self.nativeheight) * 0.5;
          self.left = (w - self.nativewidth) * 0.5;
          self.$refs.bimg.style.backgroundsize = `${self.nativeheight}px ${
            self.nativewidth
          }px`;
          self.$refs.bimg.style.backgroundPosition = `${self.left}px ${
            self.top
          }px`;
        };
      };
      this.change = true;
    },
    ...mapActions(["checklogins"])
    
  },
  watch: {
    left() {
      console.log(this.left);
    },
    top() {
      console.log(this.top);
    }
  },
  components: {
    buttombox
  }
};
</script>
<style>
.imgview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #efcbcb;
}
.none {
  display: none;
}
#canvas {
  display: none;
}
.imgchoose {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-repeat: no-repeat;
  background-color: #fff;
}
.tbox {
  position: absolute;
  /* top: 50%;
    left: 50%; */
  width: 120px;
  height: 120px;
  /* margin-top: -100px;
    margin-left: -100px; */
  box-sizing: border-box;
  border: 1px solid rgb(102, 102, 102);
  box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.5);
  background: none repeat scroll 0% 0% transparent;
}
.bottomboxs {
  width: 70%;
}
.label {
  /* width: 100%; */
  /* display: flex; */
  /* align-items: center; */
  /* justify-content: center; */
  height: 45px;
  bottom: 0;
  position: absolute;
  width: 70%;
  /* height: 100%; */
  z-index: 999;
}
.imgprev {
  transform: scale(1.8);
}
.imgupdata {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: #fff;
}
.choose {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.choosebox {
  width: 100%;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.updata-enter, .updata-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(100%);
  opacity: 0;
}
.updata-enter-active,
.updata-leave-active {
  transition: all 0.3s ease;
}
.operatebottom {
  display: inline-block;
  width: 50%;
}
.operate {
  position: absolute;
  height: 100px;
  display: flex;
  width: 100%;
  bottom: 0;
  align-items: center;
  justify-content: center;
}
</style>
