<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-box-wrapper">
      <searchbox ref="searchBoxRef"  @queryover="onQueryChange"></searchbox>
    </div>
    <!-- 中部 -->
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutRef">
      <scroll class="shortcut" ref="scrollRef" :data="scrollData" :refreshDelay="refreshDelay">
        <div>
          <!-- 热门搜索 -->
          <div class="hot-key">
            <h1 class="hot-title">热门搜索</h1>
            <ul>
              <li class="hot-item" v-for="item in hotkey">
                <span>{{ item.k }}</span>
              </li>
            </ul>
          </div>
          <!-- <div class=""></div> -->
        </div>
      </scroll>
    </div>
    <!-- 搜索结果 -->
    <div class="search-result" ref="resultRef" v-show="query">
      <suggest ref="suggestRef" :query="query" :zhida="zhida" @beforeScroll="blurInput"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { playlistMixin } from "../common/js/mixin.js";
import searchbox from "../base/searchbox";
import { getHotKey } from "../api/search.js";
import { ERR_OK } from "../api/config.js";
import scroll from "../base/scroll";
import suggest from "../components/suggest";
export default {
  mixins:[playlistMixin],
  data() {
    return {
      // 热门搜索关键系
      hotkey: [],
      // 搜索字段 (my-search-box -> my-search -> my-suggest-List)
      query: "",
      // 是否显示歌手
      zhida: true,
      refreshDelay: 100
    };
  },
  components: {
    searchbox,
    scroll,
    suggest
  },
  methods: {
    ...mapActions(["saveHistory", "delHistory", "clearHistory"]),
    blurInput(){
      console.log('去除焦点');
      this.$refs.searchBoxRef.blur();
    },
    save() {
      this.saveHistory(this.query);
      console.log(this.searchHistory);
    },
    onQueryChange(query) {
      this.query = query;
    },
    handlePlaylist(playlist) {
      //迷你播放器
      console.log('hahaasdasda');
      let bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.shortcutRef.style.bottom = bottom
      this.$refs.scrollRef.refresh()
      this.$refs.resultRef.style.bottom = bottom
      this.$refs.suggestRef.refresh()
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotkey = res.data.hotkey.slice(0, 10);
          console.log(this.hotkey);
        }
      });
    }
  },
  created() {
    this._getHotKey();
  },
  computed: {
    ...mapGetters(["searchHistory"]),
    scrollData() {
      return this.hotkey;
    }
  }
};
</script>

<style>
.search {
  height: 100%;
}
.search-box-wrapper {
  padding: 10px;
  background-color: #f4f4f4;
}
.shortcut-wrapper {
  position: fixed;
  top: 178px;
  bottom: 0;
  width: 100%;
}
.shortcut {
  height: 100%;
  overflow: hidden;
}
.hot-key {
  margin: 0 20px 20px 20px;
}
.hot-title {
  margin-bottom: 20px;
  font-size: 16px;
  color: red;
}
.hot-item {
  display: inline-block;
  padding: 5px 10px;
  margin: 0 20px 10px 0;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.14);
  font-size: 14px;
  color: #00000096;
}
.search-result {
  position: fixed;
  width: 100%;
  top: 148px;
  bottom: 0;
}
</style>
