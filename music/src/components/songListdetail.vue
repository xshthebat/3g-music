<template>
    <transition name="list-slide">
      <musiclist :songs="songs" :title="title" :bgImage="bgImage" class="list-detail" ></musiclist>
  </transition>
</template>
<script>
import { mapGetters } from "vuex";
import { getSongList } from "../api/recommend.js";
import musiclist from "../components/musiclist";
import { createSong } from "../common/js/song.js";
export default {
  data() {
    return {
      songs: []
    };
  },
  methods: {
    _getSongList() {
      if (!this.songlist.dissid) {
        this.$router.push("/recommend");
        return;
      }
      getSongList(this.songlist.dissid).then(res => {
        if(res.code ===0){
            this.songs = this._formatSong(res.cdlist[0].songlist);
        }
      });
    },
     _formatSong(list) {
      let result = [];
      list.forEach(item => {
        if (item.songid && item.albummid) {
          result.push(createSong(item));
        }
      });
      return result;
    }
  },
  created() {
    this._getSongList();
  },
  components: {
    musiclist
  },
  computed: {
    // vuex, 使用对象展开运算符将 getters 混入 computed 对象中
    ...mapGetters(["songlist"]),
    // 传入子组件
    title() {
      return this.songlist.dissname;
    },
    // 传入子组件
    bgImage() {
      return this.songlist.imgurl;
    }
  }
};
</script>
<style>
.list-slide-enter-active,
.list-slide-leave-active {
  transition: all 0.3s ease;
}
.list-slide-enter,
.list-slide-leave-to {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.list-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
