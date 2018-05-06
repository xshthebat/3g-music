<template>
  <div class="music-list">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <h1 class="title" v-html="title"></h1>
      <div class="bg-image" :style='bgStyle' ref="bgImage">
      </div>
      <div class="bg-layer" ref="layer">
        <scroll @scroll='scroll' class="list" ref="list" :data="songs" :listen-scroll="listenScroll" :probe-type="probeType">
        <div class="song-list-wrapper">
            <songlist :rank="rank"  :songs="songs"></songlist>
        </div>
       </scroll>
       <div v-show="!songs.length" class="loading-container">
           <loading :title="str"></loading>
       </div>
      </div>
  </div>
</template>
<script>
import scroll from "../base/scroll";
import loading from "../base/loading";
import songlist from "../base/songlist";
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: []
    },
    rank:{
        type:Boolean,
        default:false
    }
  },
  data() {
    return {
      scrollY: 0
    };
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
    this.str = '歌手歌曲加载中'
    console.log(this.songs);
  },
  methods: {
    back() {
      this.$router.back();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    selectItem(song,index){
        console.log(song,index);
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  components: {
    loading,
    scroll,
    songlist
  }
};
</script>
<style>
.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  background: #fff;
}
.back {
  position: absolute;
  top: 15px;
  left: 6px;
  z-index: 50;
}
.icon-back {
  display: block;
  padding: 8px;
  font-size: 16px;
  background-image: url(../common/image/back.svg);
}
.title {
  position: absolute;
  top: 15px;
  left: 10%;
  z-index: 40;
  width: 80%;
  /* no-wrap(); */
  text-align: center;
  line-height: 40px;
  font-size: 18px;
  color: #fff;
}
.bg-image {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 70%;
  transform-origin: top;
  background-size: cover;
}
.loading-container{
    position: absolute;
    width: 100%;
    top: 50%;
    margin-top: -50%;
}
.bg-layer{
    position: relative;
    height: 100%;
    background: #fff;
}
.list{
 position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
      background: #fff;
}
.song-list-wrapper{
    padding: 0 0 0 30px;
}
</style>
