<template>
  <div class="music-list">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <h1 class="title" v-html="title"></h1>
      <div class="bg-image" :style='bgStyle' ref="bgImage">
        <div class="play-wrapper">
          <div class="play" ref="playBtn" v-show="songs.length>0" @click="random">
            <i class="icon-play"></i>
            <span class="songtext">随机播放全部</span>
          </div>
        </div>
        <div class="filter" ref="filter"></div>
      </div>
      <div class="bg-layer" ref="layer"></div>
        <scroll @scroll='scroll' class="list" ref="list" :data="songs" :listen-scroll="listenScroll" :probe-type="probeType">
        <div class="song-list-wrapper">
            <songlist :rank="rank"  :songs="songs" @select="selectItem"></songlist>
        </div>
       </scroll>
       <div v-show="!songs.length" class="loading-container">
           <loading :title="str"></loading>
       </div>
  </div>
</template>
<script>
import scroll from "../base/scroll";
import loading from "../base/loading";
import songlist from "../base/songlist";
import {playlistMixin}from "../common/js/mixin";
import {mapActions,mapMutations} from "vuex";
export default {
  mixins:[playlistMixin],
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
    rank: {
      type: Boolean,
      default: false
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
    this.str = "歌手歌曲加载中";
  },
  methods: {
    handlePlaylist (playlist) {
        const _bottom = playlist.length > 0 ? '60px' : '';
        this.$refs.list.$el.style.bottom = _bottom;
        this.$refs.list.refresh();
    },
    back() {
      this.$router.back();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    selectItem(song, index) {
      this.selectPlay({
        list:this.songs,
        index:index
      });
    //  this.setstate(true);
    },
    random() {
     this.randomPlay({
       list:this.songs
     })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ]),
    ...mapMutations({
       setstate: "SET_PLAYING_STATE"
    })
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTranslateY = -this.imageHeight + 55;
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;
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
  },
  watch: {
    scrollY(newVal) {
      let translateY = Math.max(this.minTranslateY, newVal);
      let scale = 1;
      let zIndex = 0;
      let blur = 0;
      const persent = Math.abs(newVal / this.imageHeight);
      if (newVal > 0) {
        scale = 1 + persent;
        zIndex = 10;
      } else {
        blur = Math.min(20, persent * 20);
      }
      this.$refs.layer.style["transform"] = `translate3d(0,${translateY}px,0)`;
      this.$refs.filter.style["backdrop-filter"] = `blur(${blur}px)`;
      if (newVal < this.minTranslateY) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${55}px`;
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = "70%";
        this.$refs.bgImage.style.height = 0;
        // 10 7 比的简单实现
        this.$refs.playBtn.style.display = ''
      }
      this.$refs.bgImage.style["transform"] = `scale(${scale})`;
      this.$refs.bgImage.style.zIndex = zIndex;
    }
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
.filter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(7, 17, 27, 0.4);
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
.loading-container {
  position: absolute;
  width: 100%;
  top: 50%;
}
.bg-layer {
  position: relative;
  height: 100%;
  background: #fff;
  overflow: hidden;
}
.list {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background: #fff;
}
.song-list-wrapper {
  padding: 0 0 0 20px;
}
.play-wrapper {
  position: absolute;
  bottom: 20px;
  z-index: 50;
  width: 100%;
}
.play {
  box-sizing: border-box;
  width: 135px;
  padding: 7px 0;
  margin: 0 auto;
  text-align: center;
  border: 1px solid #ffcd32;
  color: #ffcd32;
  border-radius: 100px;
  font-size: 0;
}
.icon-play {
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
  background-image: url(../common/image/randomplay.svg);
  height: 16px;
  width: 16px;
}
.songtext{
   display: inline-block;
   vertical-align: middle;
   font-size: 10px;
   height: 20px;
   line-height: 20px;
}
</style>
