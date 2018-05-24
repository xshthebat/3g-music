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
              <li class="hot-item" v-for="item in hotkey" @click="addQuery(item.k)">
                <span>{{ item.k }}</span>
              </li>
            </ul>
          </div>
          <!-- 搜索历史 -->
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="search-history-title">
              <span class="search-history-text">搜索历史</span>
              <span class="search-history-clear" @click="showConfirm"><i class="search-icon-clear"></i></span>  
            </h1>
            <searchlist :searches="searchHistory" @select="addQuery" @delete="deleteHis"></searchlist>
          </div>
        </div>
      </scroll>
    </div>
    <!-- 搜索结果 -->
    <div class="search-result" ref="resultRef" v-show="query">
      <suggest ref="suggestRef" :query="query" :zhida="zhida" @beforeScroll="blurInput" @select="save"></suggest>
    </div>
    <confirm ref="confirmRef" :text="`确认要清空搜索历史吗?`" @sure="confirm" @cancel="cancel"></confirm>
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
import searchlist from "../base/searchlist";
import confirm from "../base/confirm";
export default {
  mixins: [playlistMixin],
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
    suggest,
    searchlist,
    confirm
  },
  methods: {
    ...mapActions(["saveHistory", "delHistory", "clearHistory"]),
    addQuery(k) {
      this.$refs.searchBoxRef.getQuery(k);
    },
    blurInput() {
      console.log("去除焦点");
      this.$refs.searchBoxRef.blur();
    },
    showConfirm(){
      this.$refs.confirmRef.show();
    },
    confirm(){
      this.clearHistory();
    },
    cancel(){
      return ;
    },
    save() {
      console.log("出错");
      this.saveHistory(this.query);
      console.log(this.searchHistory);
      this.$refs.scrollRef.refresh();
    },
    deleteHis(item) {
      this.delHistory(item);
    },
    onQueryChange(query) {
      this.query = query;
    },
    handlePlaylist(playlist) {
      //迷你播放器
      let bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.shortcutRef.style.bottom = bottom;
      this.$refs.scrollRef.refresh();
      this.$refs.resultRef.style.bottom = bottom;
      this.$refs.suggestRef.refresh();
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotkey = res.data.hotkey.slice(0, 10);
          // console.log(this.hotkey);
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
      return this.hotkey.concat(this.searchHistory);
    }
  },
  watch:{
    query(newval){
      if(!newval){
        console.log('显示');
        this.$nextTick(()=>{
          this.$refs.scrollRef.refresh();
        })
      }
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
.search-history {
  position: relative;
  margin: 0 20px;
}
.search-history-title {
  display: flex;
  align-items: center;
  height: 40px;
  font-size: 16px;
  color: #31c27c;
}
.search-history-text{
  flex: 1;
}
.search-icon-clear{
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: url(../common/image/search-icon-delete.svg);
}
</style>
