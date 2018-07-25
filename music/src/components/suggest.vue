<template>
    <scroll ref="scrollRef" :data="result" :pullup="pullup" @scrollToEnd="scrollToEnd" :beforeScroll="beforeScrollData"
             @beforeScroll="beforeScroll" class="suggest-list">
        <ul class="suggest-lists">
            <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
                <div class="suggest-icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="suggest-name">
                    <p class="suggest-text" v-html="getSingernameOrSongname(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" title="搜索加载中..."></loading>
        </ul>
        <div class="no-result-wrapper" v-if="!hasMore && !result.length">
            <noresult></noresult>
        </div>
    </scroll>
</template>
<script>
import { search } from "../api/search.js";
import { createSong } from "../common/js/song.js";
import  Singer  from "../common/js/Singer.js";
import loading from "../base/loading";
import scroll from "../base/scroll";
import noresult from "../base/noresult";
import { mapMutations, mapActions } from "vuex";
const TYPE_SINGER = "singer";
export default {
  data() {
    return {
      // 当前检索页数，用于下拉加载
      page: 1,
      // 每一页的数量
      perpage: 20,
      // 接受检索结果
      result: [],
      // 标志位。是否加载完
      hasMore: true,
      beforeScrollData: true,
      pullup: true
    };
  },
  props: {
    query: {
      type: String,
      default: ""
    },
    zhida: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    query(newVal) {
      this.search();
      console.log("搜索");
    }
  },
  methods: {
     ...mapMutations({
      'setSinger': 'SET_SINGER'
    }),
    ...mapActions(['insertSong']),
    selectItem(item){
        console.log(item);
        if(item.type === TYPE_SINGER){
            let singer = new Singer({
                id:item.singermid,
                name:item.singername
            })
            console.log(singer);
            this.$router.push({
                 path: `/search/${singer.id}`
            })
            this.setSinger(singer);
        } else{
            this.insertSong(item);
        }
        console.log('触发search选择');
        this.$emit('select');
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return "suggest-list-singer";
      } else {
        return "suggest-list-song";
      }
    },
    getSingernameOrSongname(item) {
      if (item.type === TYPE_SINGER) {
        console.log("是歌手");
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    scrollToEnd() {
      console.log("滑动到底");
      if (!this.hasMore) {
        //没有了
        return;
      }
      this.page++;
      console.log(this.query, this.page, this.perpage, this.zhida);
      search(this.query, this.page, this.perpage, this.zhida).then(res => {
        if (res.code === 0) {
          console.log(res);
          //处理搜索值
          this.result = this.result.concat(this._formatSearch(res.data));
          console.log(this.result);
          this._checkMore(res.data);
          console.log(this.hasMore);
        }
      });
    },
    beforeScroll() {
      this.$emit("beforeScroll");
    },
    search() {
      console.log(this.query, this.page, this.perpage, this.zhida);
      this.page = 1;
      this.hasMore = true;
      search(this.query, this.page, this.perpage, this.zhida).then(res => {
        if (res.code === 0) {
          console.log(res);
          //处理搜索值
          this.result = this._formatSearch(res.data);
          console.log(this.result);
          this._checkMore(res.data);
          console.log(this.hasMore);
        }
      });
    },
    _formatSearch(data) {
      //处理数据
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        //有歌手
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } });
      }
      if (data.song) {
        ret = ret.concat(this._normaliszeSongs(data.song.list));
      }
      return ret;
    },
    _normaliszeSongs(list) {
      let ret = [];
      list.forEach(item => {
        if (item.songid && item.albummid) {
          ret.push(createSong(item));
        }
      });
      return ret;
    },
    //是否有更多
    _checkMore(data) {
      let song = data.song;
      if (
        !song.list.length ||
        song.curnum + song.curpage * this.perpage > song.totalnum
      ) {
        this.hasMore = false; //没有更多
      }
    },
    refresh() {
      this.$refs.scrollRef.refresh(); //滚动刷新
    }
  },
  components: {
    scroll,
    loading,
    noresult
  }
};
</script>
<style>
.suggest-list {
  height: 100%;
  overflow: hidden;
  border-top: 1px solid #00000026;
}
.suggest-lists {
  padding: 0 30px;
}
.suggest-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  position: relative;
  /* border-bottom: 1px solid #00000026; */
}
.suggest-item::after{
     content: " ";
    position: absolute;
    left: 0;
    bottom: 0px;
    width: 100%;
    height: 1px;
    background-color: #31c27c;
    -webkit-transform: scaleY(0.3);
    transform: scaleY(0.3);
}
.suggest-icon {
  flex: 0 0 30px;
}
.suggest-name {
  margin-left: 15px;
  flex: 1;
  font-size: 16px;
  color: #000;
  overflow: hidden;
}
.suggest-list-singer {
  display: inline-block;
  width: 30px;
  height: 30px;
  background-image: url(../common/image/suggest-list-singer.svg);
}
.suggest-list-song {
  display: inline-block;
  width: 30px;
  height: 30px;
  background-image: url(../common/image/suggest-list-song.svg);
}
.no-result-wrapper{
    position: absolute;
    width: 100%;
    top: 50%;
    transform:translateY(-50%);
}
</style>
