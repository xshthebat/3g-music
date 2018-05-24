<template>
  <div class="rank" ref="rankRef">
    <scroll ref="scrollRef" class="toplist" :data="toplist">
        <ul>
          <li class="top-item" v-for="item in toplist" @click="selectItem(item)">
         <!-- 左图 -->
            <div class="top-icon">
              <img width="100" height="100" v-lazy="item.picUrl" @load="loadImg">
            </div>
            <ul class="top-songlist">
              <li class="top-song" v-for="(song,index) in item.songList">
                <span>{{index+1}}</span>
                <span>{{song.songname}}</span>
                <span class="top-singername">{{song.singername}}</span>
              </li>
            </ul>
          </li>
        </ul> 
        <div v-show="!toplist.length" class="top-loading">
          <loading :title="`热门排行加载中`"></loading>
        </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import scroll from "../base/scroll";
import { getRankList } from "../api/rank.js";
import loading from "../base/loading";
import { playlistMixin } from "@/common/js/mixin.js";
import { mapMutations } from "vuex";
export default {
  mixins: [playlistMixin],
  data() {
    return {
      toplist: []
    };
  },
  methods: {
    ...mapMutations({
      setRankList: "SET_RANKLIST"
    }),
    handlePlaylist(playlist) {
      let bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.rankRef.style.bottom = bottom;
      this.$refs.scrollRef.refresh();
    },
    _getRankList() {
      getRankList().then(res => {
        if (res.code === 0) {
          // console.log(res)
          this.toplist = res.data.topList;
        }
      });
    },
    loadImg() {
      if (!this.flag) {
        this.$refs.scrollRef.refresh();
        this.flag = true;
      }
    },
    selectItem(item) {
      console.log("选择", item);
       this.$router.push({
         path:`/rank/${item.id}`
       })
       this.setRankList(item);
    }
  },
  created() {
    this._getRankList();
  },
  components: {
    scroll,
    loading
  }
};
</script>

<style>
.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
.toplist {
  height: 100%;
  overflow: hidden;
}
.top-item {
  display: flex;
  margin: 0 20px;
  padding-top: 20px;
  height: 100px;
}
.top-songlist {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;
  height: 100px;
  overflow: hidden;
  font-size: 15px;
  color: #00000096;
}
.top-song {
  line-height: 25px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.top-singername {
  color: #008000a8;
}
.top-loading {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>
