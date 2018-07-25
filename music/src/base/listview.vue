<template>
  <scroll @scroll="scroll"
          :data="data"
          :listenScroll="listenScroll"
          :probe-type="probeType"
          class="listview"
          ref="listview">
    <ul>
      <li  v-for="group in data" class="list-group" ref="listGroup">
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img class="avatar" :src="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove" @touchend.stop>
      <ul>
        <li v-for="(item,index) in shortcutList" class="itme" :class="{'current': currentIndex === index}" :data-index="index"> 
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
	</scroll>
</template>
<script>
import scroll from "./scroll";
import loading from "../base/loading"
import {getData} from "../common/js/dom";
export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      currentIndex: 0, //位置
      scrollY: -1, //位置
      diff: -1
    };
  },
  computed: {
    shortcutList() {
      return this.data.map(group => {
        return group.title.substring(0, 1);
      });
    },
    fixedTitle () {
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '0'
    }
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
    this.touch = {};
    this.listHeight = [];
  },
  mounted() {
    console.log(this.data);
    this._calculateHeight();
  },
  methods: {
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height =0;
      this.listHeight.push(height)
      for(let i =0;i<list.length;i++){
        let item = list[i]
        height +=item.clientHeight;//每一组高度
        this.listHeight.push(height);
      }
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    refresh () {
        this.$refs.listview.refresh()
    },
    onShortcutTouchStart(e){
      let ahchorIndex = getData(e.target,'index');
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.ahchorIndex = ahchorIndex;
      this._scrollTo(ahchorIndex);
    },
    onShortcutTouchMove(e){
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = (this.touch.y2 - this.touch.y1)/18|0;
      let ahchorIndex = Number.parseInt(this.touch.ahchorIndex)+delta;
      this._scrollTo(ahchorIndex);
    },
    _scrollTo(index){
      //padding
      if(!index&&index!=0){
        return ;
      }
      if(index<0){
        index = 0;
      } else if(index>this.listHeight.length-2){
        index = this.listHeight.length-2 
      }
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0);
      this.scrollY = this.$refs.listview.scroll.y;
    },
    selectItem(item){
      this.$emit('select',item);
    } 
  },
  components: {
    scroll,
    loading
  },
  watch:{
    data(){
      setTimeout(()=>{
        this._calculateHeight()
      },20)
    },
    scrollY(newY){
      const listHeight = this.listHeight;
      //顶部
      if(newY>=0){
        this.currentIndex = 0;
        return ;
      }
      //中间
      for(let i=0;i<listHeight.length-1;i++){
        let height1 = listHeight[i]
        let height2 = listHeight[i+1]

        if(-newY>=height1&&-newY<height2){
          this.currentIndex = i;
          this.diff = height2+newY;
          return;
        }
      }
      //底部
      this.currentIndex = listHeight.length - 2;
    },
    diff(newVal){
      let fixedTop = (newVal>0&&newVal<30)?newVal-30:0
      if(this.fixedTop ===fixedTop){
        return 
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform=`translate3d(0,${fixedTop}px,0)`
    }
  }
};
</script>
<style>
.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.list-group {
      padding-top: 20px;
}
.list-group-title {
  border-bottom: 1px solid #00000024;
  border-top: 1px solid #00000024;
  height: 30px;
  line-height: 30px;
  padding-left: 20px;
  font-size: 12px;
  color: #333;
  background-color: #7dfdd24a;
}
.list-group-item {
  display: flex;
  padding: 32px 0 15px 10px;
  align-items: center;
  /* border-bottom: 1px solid #00000024; */
  position: relative;
}
.list-group-item::after{
   content: " ";
    position: absolute;
    left: 0;
    bottom: 0px;
    width: 100%;
    height: 1px;
    background-color: #31c27c;
    -webkit-transform: scaleY(0.3);
    transform: scaleY(0.3);
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.name {
  margin-left: 20px;
  font-size: 14px;
}
.list-shortcut {
  position: absolute;
  z-index: 30;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  padding: 20px 0;
  border-radius: 10px;
  text-align: center;
  background: rgba(119, 119, 119, 0.14);
  font-family: Helvetica;
}
.itme{
 padding: 3px;
        line-height: 1;
        color: #333;
        font-size: 10px;
}
.current{
  color:red;
}
.list-fixed{
  position: absolute;
      top: 0;
      left: 0;
      width: 100%;
}
.fixed-title{
   border-bottom: 1px solid #00000024;
  border-top: 1px solid #00000024;
  height: 30px;
  line-height: 30px;
  padding-left: 20px;
  font-size: 12px;
  color: #333;
  background-color: #7dfdd2;
}
.loading-container{
   position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
}
</style>
