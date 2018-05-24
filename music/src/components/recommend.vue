<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" :data="discList" ref="scroll">
    <div>
      <!-- 轮播 -->
      <div  v-if="recommends.length" class="slider-wrapper">
           <slider>
             <div v-for="item in recommends">
                <a :href="item.linkUrl" @click.prevent>
                  <img class="needsclick"  v-lazy="item.picUrl" @load="loadImage" style="height:150px">
                </a>
             </div>
           </slider>
      </div>
      <!-- 歌曲列表 -->
      <div class="recomment-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
          <li v-for="item in discList" class="item" @click="selectItem(item)">
            <div class="icons">
              <img v-lazy="item.imgurl" width="60" height="60">
            </div>
            <div class="text1">
              <h2 class="name" v-html="item.creator.name"></h2>
              <p class="desc" v-html="item.dissname"></p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- loading -->
     <div class="loading-container" v-show="!discList.length">
        <loading :title="loading"></loading>
     </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import { getRecommend, getDiscList } from "../api/recommend";
import { ERR_OK } from "../api/config";
import slider from "../base/slide";
import scroll from "../base/scroll";
import loading from "../base/loading";
import {playlistMixin} from '../common/js/mixin';
import { mapMutations } from 'vuex'
export default {
  mixins: [playlistMixin],
  data() {
    return {
      recommends: [],
      discList: [],
      loading: "热门歌单加载中"
    };
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
    ...mapMutations({
      setSonglist: 'SET_SONGLIST'
    }),
     handlePlaylist (playlist) {
        const bottom = playlist.length > 0 ? '60px' : '';
        this.$refs.recommend.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code == ERR_OK) {
          // console.log("轮播图数据获取成功");
          this.recommends = res.data.slider;
          // console.log(this.recommends);
        }
      });
    },
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code == ERR_OK) {
          // console.log("歌单数据获取成功");
          this.discList = res.data.list;
          // console.log(this.discList);
        }
      });
    },
    loadImage() {
      if (!this.checkLoaded) {
        if (this.$refs.scroll) {
          this.$refs.scroll.refresh();
          this.checkLoaded = true;
          console.log('初始化');
        }
      }
    },
    selectItem(item){
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
       this.setSonglist(item)
    }
  },
  components: {
    slider,
    scroll,
    loading
  }
};
</script>

<style>
/* 轮播外层样式 */
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
.slider-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.recommend-content {
  height: 100%;
  overflow: hidden;
}
.list-title {
  height: 65px;
  line-height: 65px;
  text-align: center;
  font-size: 14px;
  color: #d93f30;
}
.item {
  display: flex;
  align-items: center;
  padding: 0 20px 20px 20px;
  /* border-bottom: 0.5px solid #000000;  */
}
.icons {
  flex: 0 0 60px;
  width: 60px;
  padding-right: 20px;
}
.text1 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  line-height: 20px;
  overflow: hidden;
  font-size: 14px;
}
.name {
  margin-bottom: 10px;
}
.desc {
  color: #999;
}
.loading-container {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>
