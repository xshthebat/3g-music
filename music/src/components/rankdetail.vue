<template>
    <!-- 排行曲目 -->
    <transition name="rank-slide">
    <musiclist :songs="songs" :title="title" :bgImage="bgImage" class="rank-detail" :rank="true"></musiclist>
  </transition>
</template>
<script>
import { mapGetters } from "vuex";
import { createSong } from "../common/js/song.js";
import musiclist from "../components/musiclist";
import { getRankDetail } from "../api/rank.js";
export default {
  components: {
    musiclist
  },
  data() {
    return {
      songs: []
    };
  },
  methods: {
    _getRankDetail() {
      if (!this.rankList.id) {
        this.$router.push("/rank"); //本页禁止刷新
        return;
      }
      getRankDetail(this.rankList.id).then(res => {
        if (res.code === 0) {
          //   console.log(res.songlist)
          this.songs = this._formatSong(res.songlist);
        }
      });
    },
    _formatSong(list) {
      let result = [];
      list.forEach(item => {
        if (item.data.songid && item.data.albummid) {
          result.push(createSong(item.data));
        }
      });
      return result;
    }
  },
  computed: {
    ...mapGetters(["rankList"]),
    title() {
      return this.rankList.topTitle;
    },
    bgImage() {
    return this.rankList.picUrl;
    }
  },
  created() {
    this._getRankDetail();
    console.log(this.rankList);
  },
  mounted() {
    console.log(this.title);
  }
};
</script>
<style>
.rank-slide-enter-active,
.rank-slide-leave-active {
  transition: all 0.3s ease;
}
.rank-slide-enter,
.rank-slide-leave-to {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.rank-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
