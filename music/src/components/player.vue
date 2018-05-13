<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
          <!-- 背景 -->
          <div class="background">
              <img :src="currentSong.image" width="100%" height="100%">
          </div>
          <!-- top -->
          <div class="player-top">
              <div class="player-back" @click="back">
                  <i class="player-icon-back"></i>
              </div>
              <h1 class="player-title" v-html="currentSong.name"></h1>
              <h2 class="subtitle" v-html="currentSong.singer"></h2>
          </div>
          <!-- middle -->
          <div class="player-middle">
              <!-- <div class="middle-l" ref="middleL">
                  <div class="cd-wrapper" ref="cdWrapper">
                      <div class="cd" :class="cdCls">
                          <img :src="currentSong.image" class="cdimage">
                      </div>
                  </div>
              </div> -->
              <scroll class="middle-r" ref="lyricList" :data="currentLyric&&currentLyric.lines">
              <div class="lyric-wrapper">
                  <div v-if="currentLyric" @click="clicklyric">
                      <p ref="lyricLine" class="lytext" v-for="(line,index) of currentLyric.lines" :class="{'lycurrent': currentLineNum === index}">{{ line.txt }}</p>
                  </div>
              </div>
              </scroll>
          </div>
          <!-- bottom -->
          <div class="player-bottom">
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
                    <i :class="iconMode"></i>
                </div>
                <!-- 上一首 -->
                <div class="musicicon i-left" >
                   <i @click="prev" class="icon-prev"></i>
                </div>
                <!-- 播放与暂停 -->
                 <div class="musicicon i-center" >
                    <i  @click="togglePlaying" :class="playIcon"></i>
                </div>
                <!-- 下一首 -->
                <div class="musicicon i-right" >
                  <i  @click="next" class="icon-next"></i>
                </div>
                <!-- 喜欢 -->
                <div class="musicionc i-right ac">
                  <i @click="toggleLike" :class="likeIcon"></i>
                </div>
              </div>
          </div>
      </div>
    </transition >
         <!--播放器内核-->
    <audio ref="audio" :src="currentSong.url" @playing="ready" @pause="paused" @error="error" @ended="ended" @timeupdate="updateTime"></audio>
  </div>
</template>
<script>
import scroll from "../base/scroll";
import progressbar from "../base/progressbar";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { playMode } from "../common/js/config";
import { shuffle } from "../common/js/util";
import Lyric from "lyric-parser";
export default {
  data() {
    return {
      songReady: false, //歌曲是否就位
      currentTime: 0, //当前歌曲播放时间
      radius: 32, //半径
      currentLyric: null, //歌词
      currentLineNum: 0, //歌词行数
      currentShow: "cd", //展示界面默认 cd
      prrgresschanging: false //进度条正在改变标志
    };
  },
  computed: {
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
    getLyric() {
      this.currentSong
        .getlyric()
        .then(lyric => {
          if (this.currentSong.lyric !== lyric) {
            //检测歌词是否正确;
            return;
          }
          this.$nextTick(() => {
            this.currentLyric = new Lyric(lyric, this.handleLyric);
            this.isPureMusic = !this.currentLyric.lines.length; //没歌词音乐
            if (this.isPureMusic) {
              this.pureMusicLyric = this.currentLyric.lrc
                .replace(timeExp, "")
                .trim();
              this.playingLyric = this.pureMusicLyric;
            } else {
              if (this.playing && this.canLyricPlay) {
                // 这个时候有可能用户已经播放了歌曲，要切到对应位置
                this.currentLyric.seek(this.currentTime * 1000);
              }
            }
            //设置当前歌词轴
            console.log(this.currentLyric);
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
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        let lineEl = this.$refs.lyricLine[0];
        this.$refs.lyricList.scrollTo(lineEl, 1000);
      }
      this.playingLyric = txt;
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
      this.setCurrentIndex(index); //重设置当前页
      if (!this.playing) {
        this.togglePlaying();
      }
    },
    next() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex + 1;
      if (index === this.playlist.length) {
        index = 0;
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
      if (!this.songReady) {
        return;
      }
      this.setPlayingState(!this.playing);
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
      clearTimeout(this.timer);
      this.songReady = true;
      this.canLyricPlay = true;
      // this.savePlayHistory(this.currentSong) //历史
      if (this.currentLyric && !this.isPureMusic) {
        this.currentLyric.seek(this.currentTime * 1000); //播放后同步歌词
      }
    },
    ended() {
      this.currentTime = 0;
      if (this.mode === playMode.once) {
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
      clearTimeout(this.timer);
      this.songReady = true;
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
          this.onProgressBarChange(item.time/1000 / this.currentSong.duration);
        }
      });
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
    progressbar
  },
  watch: {
    currentSong(newsong, oldsong) {
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
      this.songReady = false;
      this.$refs.audio.src = newsong.url;
      this.$nextTick(() => {
        this.$refs.audio.play();
      });
      //若歌曲 5s 未播放，则认为超时，修改状态确保可以切换歌曲。
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        console.log("超时");
        this.songReady = true;
      }, 5000);
      this.getLyric(); //加载歌词;
    },
    playing(newPlaying) {
      if (!this.songReady) {
        console.log("歌曲未准备好");
        return;
      }
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
      });
      console.log(newPlaying);
      if (!newPlaying) {
        if (this.fullScreen) {
          //显示全屏状态
          console.log("显示全屏");
        } else {
          //显示迷你播放器状态
          console.log("显示迷你");
        }
      }
    },
    fullScreen(newVal) {
      //全屏
      if (newVal) {
        this.$nextTick(() => {
          //清除歌词列表
          console.log("清除列表，初始当前歌曲进度条百分比");
          //播放条设置当前歌曲百分比
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
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
