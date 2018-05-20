<template>
  <transition name="listfade" @before-enter="wrapper" @before-leave="wrapper"  @leave="outwraptranslate" @after-enter="end" @after-leave="end">
      <div class="playlist" @click="hide" v-show="showFlag">  
          <div class="play-list-wrapper" @click.stop :class="{ 'wrapperactive': enterOrLeave,'outwrappertranslate':outtranslate }">
              <!-- 头部列表 -->
              <div class="list-header">
                  <h1 class="play-list-title">
                      <i class="play-list-icon" :class="modeicon" @click.prevent="changemode"></i>
                      <span class="play-list-text">{{modeText}}</span>
                      <span class="play-list-clear" @click="showConfirm"></span>
                  </h1>
              </div>
              <!-- 中部列表 -->
              <scroll ref="scrollRef" :data="sequenceList" class="list-content" >
                <transition-group name="play-list" tag="ul">
                  <li :key="item.id" ref="listRef" class="play-list-item" v-for="(item,index) in sequenceList" @click="selectItem(item,index)">
                    <span class="list-item-text" :class="getCurrentIcon(item)">{{ item.name }}</span>
                    <span  class="list-item-like" @click.stop="toggleLike(item)">
                      <i class="list-like-icon" :class="likeit(item)"></i>
                    </span>
                    <span class="play-list-delete" @click.stop="deleteOne(item)">
                      <i class="list-icon-delete"></i>
                    </span>
                  </li>
                </transition-group>
              </scroll>
              <!-- 下部添加 -->
              <!-- 关闭 -->
              <div class="list-close">
                <span @click="hide">关闭</span>
              </div>
          </div>
          <confirm ref="confirmRef" @sure="deletelist"></confirm>
      </div>
  </transition>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { playMode } from "../common/js/config";
import { shuffle } from "../common/js/util";
import confirm from "../base/confirm";
import scroll from "../base/scroll";
export default {
  data(){
    return {
        showFlag:false,
        enterOrLeave:false,
        outtranslate:false
        }
  },
  methods: {
    wrapper(){
      this.enterOrLeave = true;
    },
    outwraptranslate(){
      this.outtranslate = true;
    },
    end(){
      this.enterOrLeave = false;
      this.outtranslate = false;
    },
    show(){
      this.showFlag = true;
      this.$nextTick(()=>{
         this.$refs.scrollRef.refresh();
          this.scrollToCurrent(this.currentSong);
      })
    },
    hide(){
      this.showFlag = false;
    },
    changemode() {
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
    deleteOne(item){
      this.deleteSong(item);
      //删空歌单
      if (!this.playlist.length) {
        this.showFlag = false;
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
    showConfirm(){
        this.$refs.confirmRef.show();
    },
    deletelist(){
      console.log('清空播放列表');
      this.deleteSonglist();
      this.hide();
    },
     getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return 'icon-playlist'
      }
      return ''
    },
    toggleLike(item){
      console.log(item);
      if (!this._likesong(item)) {
        //喜欢
        this.likeSong({
          song: item
        });
      } else {
        //不喜欢
        this.unlikeSong({
          song: item
        });
      }
    },
    likeit(item){
      return this._likesong(item)? 'itemlike':'itemunlike';
    },
    _likesong(cur) {
      if (this.likelist.findIndex((item) => {
         return item.id === cur.id;
        }) === -1) {
        //未喜欢
        return false;
      } else {
        //喜欢
        return true;
      }
    },
    selectItem(item,index){
      //切歌
      if (this.mode === playMode.random) {
        //随机播放
        index = this.playlist.findIndex((song) => {
          return song.id === item.id
        })
      }
      //设置当前歌曲
      this.setCurrentIndex(index);
      // 如果是暂停，切歌后自动播放
      this.setPlayingState(true);
    },
    scrollToCurrent(current){
      let index = this.sequenceList.findIndex((song) => {
        return song.id === current.id
      })
      this.$refs.scrollRef.scrollToElement(this.$refs.listRef[index], 300);
    },
    ...mapMutations({
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAYLIST",
      setlikeSongs: "SET_LIKE_LIST"
    }),
    ...mapActions(['deleteSonglist','deleteSong','likeSong','unlikeSong'])
  },
  computed: {
    modeicon() {
      return this.mode === playMode.sequence
        ? "list-sequence"
        : this.mode === playMode.loop
          ? "list-loop"
          : this.mode === playMode.once ? "list-once" : "list-random";
    },
    modeText() {
      let mode = "";
      if (this.mode === playMode.sequence) {
        mode = "顺序播放";
      } else if (this.mode === playMode.loop) {
        mode = "循环播放";
      } else if (this.mode === playMode.once) {
        mode = "单曲循环";
      } else if (this.mode === playMode.random) {
        mode = "随机播放";
      } else {
        mode = "";
      }
      return `${mode}(${this.playlist.length}首)`;
    },
    ...mapGetters([
      "sequenceList",
      "mode",
      "likelist",
      "currentSong",
      "playlist"
    ])
  },
  watch: {
    // 切歌后滚动至第一个
    currentSong(newVal, oldVal) {
      if (!newVal.id || !oldVal.id) {
        return
      }
      if (!this.showFlag || newVal.id === oldVal.id) {
        return
      }
      this.scrollToCurrent(newVal)
    }
  },
  components:{
      confirm,
      scroll
  }
};
</script>
<style>
.playlist {
  display: flex;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  height: 100vh;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.3);
}
.play-list-wrapper {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #f5f5f5;
}
.list-header {
  position: relative;
  padding: 10px 30px 10px 20px;
  border-bottom: 1px solid #00000017;
}
.play-list-title {
  display: flex;
  align-items: center;
}
.play-list-icon {
  margin-right: 10px;
  font-size: 30px;
  width: 30px;
  height: 30px;
}
.play-list-clear{
   position: absolute;
   right: 30px;
   width: 30px;
   height: 30px;
   background-image: url("../common/image/list-delete.svg");
}
.play-list-text {
  font-size: 16px;
}
.list-sequence {
  background-image: url("../common/image/list-sequence.svg");
}
.list-loop {
  background-image: url("../common/image/list-loop.svg");
}
.list-once {
  background-image: url("../common/image/list-once.svg");
}
.list-random {
  background-image: url("../common/image/list-random.svg");
}
.list-close{
   width: 100%;
   position: relative;
   bottom: 0;
   height: 50px;
   border-top: 1px solid #00000017;
   display: flex;
   justify-content: center;
   align-items: center;
}
.list-content {
      max-height: 240px;
      overflow: hidden;
}
.play-list-item{
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 30px 0 20px;
  overflow: hidden;
  margin-left: 15px;
  border-bottom: 1px solid #00000017;
  position: relative;
}
.icon-playlist{
  color: #008000a8;
}
.play-list-delete{
  position: absolute;
  right: 20px;
  display: flex;
   justify-content: center;
   align-items: center;
}
.list-item-text{
  font-size: 14px;
}
.list-icon-delete{
  display: inline-block;
  width: 14px;
  height: 14px;
  background-image: url(../common/image/list-icon-delete.svg);
}
.list-item-like{
  position: absolute;
  right: 60px;
   display: flex;
   justify-content: center;
   align-items: center;
}
.list-like-icon{
  display: inline-block;
  width: 20px;
  height: 20px;
}
.itemlike{
  background-image: url(../common/image/list-item-like.svg);
}
.itemunlike{
  background-image: url(../common/image/item-unlike.svg);
}
.listfade-enter-active,.listfade-leave-active{
  transition: opacity 0.3s;
}
.listfade-enter,.listfade-leave-to{
  opacity: 0;
}
.wrapperactive{
  transition: all 0.3s;
}
.outwrappertranslate{
  transform: translate3d(0, 100%, 0);
}
.play-list-enter-active,.play-list-leave-active{
   transition: all 0.1s;
} 
.play-list-enter,.play-list-leave-to {
   height: 0;
}
</style>

