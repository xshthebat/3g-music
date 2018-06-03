<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal" @enter="Enter" @after-enter="afterEnter" @leave="Leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
          <!-- 背景 -->
          <div class="background">
              <img :src="currentSong.image" width="100%" height="100%">
          </div>
          <!-- top -->
          <div class="player-top" ref="top" :class="{'top-enter':isenter,'top-leave':!isenter}">
              <div class="player-back" @click="back">
                  <i class="player-icon-back"></i>
              </div>
              <h1 class="player-title" v-html="currentSong.name"></h1>
              <h2 class="subtitle" v-html="currentSong.singer"></h2>
          </div>
          <!-- middle -->
          <div class="player-middle" @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd">
              <div class="middle-l" ref="middleL">
                  <div class="cd-wrapper" ref="cdWrapper">
                      <div class="cd" :class="cdCls">
                          <img :src="currentSong.image" class="cdimage">
                      </div>
                  </div>
                  <div class="cd-lyric-wrapper">
                    <p class="lytext" v-show="isPureMusic">此歌曲为没有填词的纯音乐，请您欣赏</p>
                    <div class="playing-lyric" v-show="!isPureMusic">{{playingLyric}}</div>
                  </div>
              </div>
              <scroll class="middle-r" ref="lyricList" :listenScroll="true" :data="currentLyric&&currentLyric.lines">
              <div class="lyric-wrapper">
                  <div v-if="currentLyric" @click="clicklyric">
                      <p ref="lyricLine" class="lytext" v-for="(line,index) of currentLyric.lines" :class="{'lycurrent': currentLineNum === index}">{{ line.txt }}</p>
                  </div>
                  <p class="lytext" v-show="isPureMusic">此歌曲为没有填词的纯音乐，请您欣赏</p>
              </div>
              </scroll>
          </div>
          <!-- bottom -->
          <div class="player-bottom" ref="bottom" :class="{'bottom-enter':isenter,'bottom-leave':!isenter}">
              <div class="dot-wrapper">
                <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
                <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
              </div>
              <div class="progress-wrapper">
                <span class="time time-l">{{format(currentTime)}}</span>
                    <div class="progress-bar-wrapper">
                        <progressbar ref="progressBar":percent="percent" @percentChange="onProgressBarChange" @percentChanging="onProgressBarChanging"/>
                    </div>
                <span class="time time-r">{{format(currentSong.duration)}}</span>
              </div>
               <div class="operators">
                <!-- 播放模式 -->
                 <div class="musicicon i-left ab"  @click="changeMode">
                    <i :class="iconMode" ></i>
                </div>
                <!-- 上一首 -->
                <div class="musicicon i-left" >
                   <i @click="prev" class="icon-prev" ref="prev"></i>
                </div>
                <!-- 播放与暂停 -->
                 <div class="musicicon i-center" >
                    <i  @click.prevent="togglePlaying" :class="playIcon" ref="play"></i>
                </div>
                <!-- 下一首 -->
                <div class="musicicon i-right" >
                  <i  @click="next" class="icon-next"  ref="next"></i>
                </div>
                <!-- 喜欢 -->
                <div class="musicionc i-right ac">
                  <i @click="toggleLike" :class="likeIcon"></i>
                </div>
              </div>
          </div>
      </div>
    </transition >
    <!-- mini播放器 -->
    <transition name="mini">
     <div class="mini-player" v-show="!fullScreen" @click="open">
      <div class="minicon" >
          <img class="minicd" :src="currentSong.image" :class="cdCls" width="40" height="40">
      </div>
      <div class="minitext">
          <h2 class="minname" v-html="currentSong.name"></h2>
          <p class="mindesc" v-html="currentSong.singer"></p>
      </div>
      <div class="procontrol">
        <progresscirle :radius="radius" :percent="percent">
          <i @click.stop.prevent="togglePlaying" class="icon-mini" :class="miniIcon"></i>
        </progresscirle>
      </div>
     <div class="listcontrol" @click.stop.prevent="showPlaylist">
        <i class="icon-list"></i>
     </div>
     </div>
    </transition>
    <!-- 播放列表 -->
    <playlist ref="playlistref"></playlist>
         <!--播放器内核-->
    <audio ref="audio" :src="currentSong.url" @playing="ready" @pause="paused" @error="error" @ended="ended" @timeupdate="updateTime"></audio>
  </div>
</template>
<script>
import scroll from "../base/scroll";
import animations from "create-keyframe-animation"; //动画库
import progressbar from "../base/progressbar";
import progresscirle from "../base/progresscircle";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { playMode } from "../common/js/config";
import { shuffle } from "../common/js/util";
import Lyric from "lyric-parser";
import playlist from "../components/playlist";
export default {
  data() {
    return {
      currentTime: 0, //当前歌曲播放时间
      radius: 32, //半径
      currentLyric: null, //歌词
      currentLineNum: 0, //歌词行数
      currentShow: "cd", //展示界面默认 cd
      prrgresschanging: false, //进度条正在改变标志
      playingLyric: "无歌词数据",
      isPureMusic: false, //纯音乐
      entering: false //进入标志
    };
  },
  created() {
    this.touch = {};
  },
  mounted() {
    // let self = this;
    // function fakeClick(fn) {
    //     let evt;
    //     console.log('可播放');
    //     if (document.createEvent) {
    //         evt = document.createEvent("MouseEvents");
    //         if (evt.initMouseEvent) {
    //             evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    //             self.$refs.play.dispatchEvent(evt);
    //         }
    //     }
    // }
    // this.$refs.audio.addEventListener("canplay",fakeClick);
  },
  computed: {
    isenter() {
      return this.entering ? true : false;
    },
    cdCls() {
      return this.playing ? "cdplay" : "cdplay pause";
    },
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-squence"
        : this.mode === playMode.loop
          ? "icon-loop"
          : this.mode === playMode.once ? "icon-once" : "icon-random";
    },
    playIcon() {
      return this.playing ? "icon-puase" : "iconplay";
    },
    likeIcon() {
      return this._likesong() ? "icon-like" : "icon-unlike";
    },
    miniIcon() {
      return this.playing ? "minpuase" : "minplay";
    },
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    ...mapGetters([
      "fullScreen",
      "playlist",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList",
      "likelist"
    ])
  },
  methods: {
    Enter(el, done) {
      setTimeout(() => {
        this.entering = true;
      }, 0);
      const { x, y, scale } = this._getPosAndScale();
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      };
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          esing: "linear",
          delay: 100
        }
      }); //设置动画
      animations.runAnimation(this.$refs.cdWrapper, "move", done);
      // console.log(this);
      // console.log(done); //done内部就是一个异步执行过程。。
    },
    afterEnter() {
      animations.unregisterAnimation("move"); //移除动画
      this.$refs.cdWrapper.style.animation = "";
    },
    Leave(el, done) {
      console.log("离开");
      this.entering = false;
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style.transition = `all 0.4s ease`;
      this.$refs.cdWrapper.style[
        "transform"
      ] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      this.$refs.cdWrapper.style[
        "webkitTransform"
      ] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener("transitionend", done); //动画结束
    },
    afterLeave() {
      this.$refs.cdWrapper.style["transform"] = "";
      this.$refs.cdWrapper.style["webkitTransform"] = "";
      this.$refs.cdWrapper.style.transition = "";
    },
    _getPosAndScale() {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8; //屏幕宽度
      const scale = targetWidth / width; //百分比
      const x = -(window.innerWidth / 2 - paddingLeft); //计算x偏移值
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom; //y偏移值
      return { x, y, scale };
    },
    middleTouchStart(e) {
      this.touch.initiated = true;
      this.touch.move = false;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const touch = e.touches[0];
      const deltaX = (this.deltaX = touch.pageX - this.touch.startX);
      const deltaY = (this.deltaY = touch.pageY - this.touch.startY);

      //计算触摸距离
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        //去除横向
        return;
      }
      console.log("进入");
      if (!this.touch.moved) {
        this.touch.moved = true;
      }
      const left = this.currentShow === "cd" ? 0 : -window.innerWidth;
      const offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + deltaX)
      );
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      this.$refs.lyricList.$el.style[
        "transform"
      ] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style["transitionDuration"] = 0;
      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      this.$refs.middleL.style["transitionDuration"] = 0;
    },
    middleTouchEnd(e) {
      if (!this.touch.moved) {
        return;
      }
      let offsetWidth;
      let opacity;
      let ifsroll =
        Math.abs(this.deltaY) < Math.abs(this.deltaX) ? true : false;
      if (this.currentShow === "cd") {
        if (this.touch.percent > 0.1 && ifsroll) {
          //判断是否横向滑动，并且超出一定范围
          //直接设置值
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.currentShow = "lyric";
        } else {
          //否则不变
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        if (this.touch.percent < 0.9 && ifsroll) {
          //同上
          offsetWidth = 0;
          this.currentShow = "cd";
          opacity = 1;
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      const time = 300;
      //设置动画过度
      this.$refs.lyricList.$el.style[
        "transform"
      ] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style["transitionDuration"] = `${time}ms`;
      this.$refs.middleL.style.opacity = opacity;
      this.$refs.middleL.style["transitionDuration"] = `${time}ms`;
      this.touch.initiated = false;
    },
    getLyric() {
      this.currentSong
        .getlyric()
        .then(lyric => {
          if (this.currentSong.lyric !== lyric) {
            //检测歌词是否正确;
            return;
          }

          this.$nextTick(() => {
            this.isPureMusic = false; //纯音乐
            this.currentLyric = new Lyric(lyric, this.handleLyric);
            if (this.currentLyric.lines.length === 0) {
              this.isPureMusic = true;
            }
            if (this.isPureMusic) {
              console.log(this.isPureMusic, "纯音乐");
              return;
            } else {
              if (this.playing && this.canLyricPlay) {
                // 这个时候有可能用户已经播放了歌曲，要切到对应位置
                this.currentLyric.seek(this.currentTime * 1000);
              }
            }
            //设置当前歌词轴
            console.log(this.currentLineNum);
          });
        })
        .catch(e => {
          console.log(e);
          this.currentLyric = null;
          this.playingLyric = "";
          this.currentLineNum = 0;
        });
    },
    handleLyric({ lineNum, txt }) {
      if (!this.$refs.lyricLine) {
        return;
      }
      this.currentLineNum = lineNum;
      this.$nextTick(() => {
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5];
          this.$refs.lyricList.scrollToElement(lineEl, 1000);
        } else {
          let lineEl = this.$refs.lyricLine[0];
          this.$refs.lyricList.scrollTo(lineEl, 1000);
        }
        this.playingLyric = txt; //当前歌词
      });
    },
    open() {
      this.setFullScreen(true);
    },
    back() {
      //显示彻底清除 实际并不是返回而是最小化
      this.setFullScreen(false);
    },
    format(interval) {
      interval = interval | 0;
      const minute = (interval / 60) | 0;
      const second = this._pad(interval % 60);
      return `${minute}:${second}`; //当前时间
    },
    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        //1位数
        num = "0" + num;
        len++;
      }
      return num;
    },
    changeMode() {
      const mode = (this.mode + 1) % 4;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      //保证currentIndex不变
      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    prev() {
      //上一曲
      // if(!this.songReady){
      //   return ;
      // }
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playlist.length - 1;
      }
      if (this.playlist.length === 1) {
        //需要重新播放
        this.once();
      }
      this.setCurrentIndex(index); //重设置当前页
      if (!this.playing) {
        this.togglePlaying();
      }
    },
    next() {
      let index = this.currentIndex + 1;
      if (index === this.playlist.length) {
        index = 0;
      }
      if (this.playlist.length === 1) {
        //需要重新播放
        console.log("重新播放");
        this.once();
      }
      this.setCurrentIndex(index); //重设置当前页
      if (!this.playing) {
        this.togglePlaying();
      }
    },
    paused() {
      this.setPlayingState(false);
      console.log("停歌词");
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
    },
    resetCurrentIndex(list) {
      //寻找index
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      //重设曲目
      this.setCurrentIndex(index);
    },
    togglePlaying() {
      console.log("播放");
      this.setPlayingState(!this.playing);
      if(this.playing){
        this.$refs.audio.play();
      } else{
        this.$refs.audio.pause();
      }
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    toggleLike() {
      if (!this._likesong()) {
        //喜欢
        this.likeSong({
          song: this.currentSong
        });
      } else {
        //不喜欢
        this.unlikeSong({
          song: this.currentSong
        });
      }
    },
    _likesong() {
      if (this._findindex(this.likelist, this.currentSong) === -1) {
        //未喜欢
        return false;
      } else {
        //喜欢
        return true;
      }
    },
    _findindex(list, song) {
      return list.findIndex(item => {
        return item.id === song.id;
      });
    },
    ready() {
      console.log("播放中");
      if(!this.playing){
        this.setPlayingState(true);
      }
      clearTimeout(this.timer);
      this.canLyricPlay = true;
      // this.savePlayHistory(this.currentSong) //历史
      if (this.currentLyric && !this.isPureMusic) {
        this.currentLyric.seek(this.currentTime * 1000); //播放后同步歌词
      }
    },
    ended() {
      this.currentTime = 0;
      if (this.mode === playMode.once || this.playlist.length === 1) {
        this.once();
        return;
      }
      if (this.mode === playMode.loop) {
        this.next(); //应该是this.loop;
      } else {
        this.next();
      }
    },
    updateTime(e) {
      if (this.prrgresschanging) {
        return;
      }
      this.currentTime = e.target.currentTime;
    },
    error() {
      console.log("出错");
      alert("err");
      clearTimeout(this.timer);
    },
    onProgressBarChange(percent) {
      const currentTime = this.currentSong.duration * percent; //计算现在时间
      this.currentTime = this.$refs.audio.currentTime = currentTime; //重置时间
      if (!this.playing) {
        this.togglePlaying(); //未播放直接播放
      }
      if (this.currentLyric) {
        this.currentLyric.seek(this.currentTime * 1000);
      }
      this.prrgresschanging = false;
    },
    onProgressBarChanging(percent) {
      this.prrgresschanging = true;
      this.currentTime = this.currentSong.duration * percent; //计算当前时间
      if (this.currentLyric) {
        this.currentLyric.seek(this.currentTime * 1000);
      }
    },
    once() {
      this.onProgressBarChange(0);
      this.$refs.audio.play();
    },
    clicklyric(e) {
      let text = e.target.innerText;
      let lyric = this.currentLyric.lines;
      console.log(text);
      lyric.forEach(item => {
        if (text === item.txt) {
          console.log(item.time, this.currentSong.duration);
          this.onProgressBarChange(
            item.time / 1000 / this.currentSong.duration
          );
        }
      });
    },
    showPlaylist() {
      this.$refs.playlistref.show();
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAYLIST",
      setlikeSongs: "SET_LIKE_LIST"
    }),
    ...mapActions({
      likeSong: "likeSong",
      unlikeSong: "unlikeSong"
    })
  },
  components: {
    scroll,
    progressbar,
    progresscirle,
    playlist
  },
  watch: {
    currentSong(newsong, oldsong) {
      console.log("曲目变化");
      if (!newsong.id || !newsong.url || newsong.id === oldsong.id) {
        return;
      }
      console.log("播放", newsong);
      console.log("初始化");
      if (this.currentLyric) {
        this.currentLyric.stop();
        // 重置为null
        this.currentLyric = null;
        this.currentTime = 0;
        this.playingLyric = "";
        this.currentLineNum = 0;
      }
      this.$refs.audio.src = newsong.url;
      if (this.playing) {
        console.log('直接播放');
        this.$nextTick(() => {
          this.$refs.audio.play();
        });
      }
      this.getLyric(); //加载歌词;
    },
    playing(newPlaying) {
      if (newPlaying) {
        this.$nextTick(() => {
          this.$refs.audio.play();
        });
      } else{
        this.$nextTick(() => {
          this.$refs.audio.pause();
        });
      }
    },
    fullScreen(newVal) {
      //全屏
      if (newVal) {
        this.$nextTick(() => {
          //清除歌词列表
          console.log("清除列表，初始当前歌曲进度条百分比");
          //播放条设置当前歌曲百分比
          this.$refs.lyricList.refresh();
          this.$refs.progressBar.setProgressOffest(this.percent);
        });
      }
    }
  }
};
</script>
<style>
.normal-player {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 150;
  background-color: #fff;
  background: -webkit-linear-gradient(top, #504e4e, #000);
}
.background {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.6;
  filter: blur(20px);
}
.player-top {
  position: relative;
  top: 0;
  left: 6px;
  z-index: 50;
  transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
}
.player-back {
  position: absolute;
  top: 0;
  z-index: 50;
}
.player-icon-back {
  display: block;
  height: 16px;
  width: 16px;
  background-image: url(../common/image/back.svg);
}
.player-title {
  width: 70%;
  margin: 15px auto 0;
  line-height: 40px;
  text-align: center;
  font-size: 18px;
  color: #fff;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.subtitle {
  line-height: 20px;
  text-align: center;
  font-size: 14px;
  color: #fff;
}
.cdimage {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 50%;
  border: 10px solid rgba(255, 255, 255, 0.1);
}
.cd {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.cd-wrapper {
  position: absolute;
  left: 10%;
  top: 0;
  width: 80%;
  box-sizing: border-box;
  height: 100%;
}
.player-middle {
  position: fixed;
  width: 100%;
  top: 80px;
  bottom: 170px;
  white-space: nowrap;
  font-size: 0;
}
.middle-l {
  display: inline-block;
  vertical-align: top;
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 80%;
}
.player-bottom {
  position: absolute;
  bottom: 50px;
  width: 100%;
  transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
}
.dot-wrapper {
  text-align: center;
  font-size: 0;
}
.progress-wrapper {
  display: flex;
  align-items: center;
  width: 80%;
  margin: 0 auto;
  padding: 10px 0;
}
.cdplay {
  animation: rotate 20s linear infinite;
}
.pause {
  animation-play-state: paused;
}
.time {
  color: #fff;
  font-size: 10px;
  flex: 0 0 30px;
  line-height: 30px;
  width: 30px;
}
.time-l {
  text-align: left;
}
.time-r {
  text-align: right;
}
.progress-bar-wrapper {
  flex: 1;
}
.operators {
  display: flex;
  align-items: center;
}
.musicicon {
  flex: 1;
  color: #fff;
}
.musicicon > i {
  font-size: 30px;
}
.i-left {
  text-align: right;
}
.i-right {
  text-align: left;
}
.i-center {
  text-align: center;
}
.icon-squence {
  display: inline-block;
  background-image: url(../common/image/squenceplay.svg);
  width: 32px;
  height: 32px;
}
.icon-like {
  display: inline-block;
  background-image: url(../common/image/like.svg);
  width: 32px;
  height: 32px;
}
.icon-unlike {
  display: inline-block;
  background-image: url(../common/image/unlike.svg);
  width: 32px;
  height: 32px;
}
.icon-loop {
  display: inline-block;
  background-image: url(../common/image/loopplay.svg);
  width: 32px;
  height: 32px;
}
.icon-once {
  display: inline-block;
  background-image: url(../common/image/onceplay.svg);
  width: 32px;
  height: 32px;
}
.icon-random {
  display: inline-block;
  background-image: url(../common/image/ranomplay.svg);
  width: 32px;
  height: 32px;
}
.icon-prev {
  display: inline-block;
  background-image: url(../common/image/prevsong.svg);
  width: 48px;
  height: 48px;
}
.icon-next {
  display: inline-block;
  background-image: url(../common/image/nextsong.svg);
  width: 48px;
  height: 48px;
}
.icon-puase {
  display: inline-block;
  background-image: url(../common/image/pauseicon.svg);
  width: 64px;
  height: 64px;
}
.iconplay {
  display: inline-block;
  background-image: url(../common/image/iconplay.svg);
  width: 64px;
  height: 64px;
}
.ab {
  position: absolute;
  margin-left: 20px;
}
.ac {
  position: absolute;
  right: 0;
  margin-right: 20px;
}
.middle-r {
  display: inline-block;
  vertical-align: top;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.lyric-wrapper {
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
  text-align: center;
}
.lytext {
  line-height: 32px;
  color: #fff;
  font-size: 14px;
}
.lycurrent {
  color: aquamarine;
  font-size: 20px;
}
.normal-enter-active {
  transition: all 0.4s;
}
.normal-leave-active {
  transition: all 0.4s;
}
.normal-enter,
.normal-leave-to {
  opacity: 0;
}
.top-enter {
  opacity: 1;
  transform: translate3d(0, 0px, 0);
}
.top-leave {
  opacity: 0;
  transform: translate3d(0, -100px, 0);
}
.bottom-enter {
  opacity: 1;
  transform: translate3d(0, 0px, 0);
}
.bottom-leave {
  opacity: 0;
  transform: translate3d(0, 100px, 0);
}
.mini-enter-active,
.mini-leave-active {
  transition: all 0.4s;
}
.mini-enter,
.mini-leave-to {
  opacity: 0;
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.minicon {
  flex: 1;
  margin-left: 15px;
}
.minicd {
  border-radius: 50%;
  border: 1px solid #31c27ca6;
}
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  height: 60px;
  background: #f5f5f5;
}
.minitext {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  line-height: 20px;
  overflow: hidden;
  position: absolute;
  left: 75px;
}
.minname {
  margin-bottom: 2px;
  font-size: 14px;
  color: #000;
}
.mindesc {
  font-size: 10px;
  color: #008000a8;
}
.minicontrol,
.procontrol,
.listcontrol {
  flex: 0 0 30px;
  width: 30px;
  padding: 0 10px;
}
.icon-mini {
  width: 24px;
  height: 24px;
  position: absolute;
  left: 5px;
  top: 4px;
}
.minpuase {
  background-image: url(../common/image/minipause.svg);
}
.minplay {
  background-image: url(../common/image/miniplay.svg);
}
.listcontrol {
  height: 30px;
}
.icon-list {
  width: 32px;
  height: 32px;
  background-image: url(../common/image/minilist.svg);
  position: absolute;
}
.cd-lyric-wrapper {
  width: 80%;
  margin: 30px auto 0 auto;
  overflow: hidden;
  text-align: center;
}
.playing-lyric {
  height: 20px;
  line-height: 20px;
  font-size: 15px;
  color: #fff;
}
</style>
