<template>
  <div class="singer" ref="singer">
    <listview @select="selectSinger" v-if="singers.length" :data="singers" ref="list"></listview>
    <router-view></router-view>
  </div>
</template>
<script>
import { getSingerList } from "../api/singer";
import { ERR_OK } from "../api/config";
import Singer from "../common/js/Singer";
import listview from "../base/listview";
import {mapMutations} from 'vuex';

export default {
  data() {
    return {
      singers: []
    };
  },
  created() {
    this._getSingerList();
  },
  methods: {
    selectSinger(singer){
      this.$router.push({
          path: `/singer/${singer.id}`
        })
      console.log(singer.name);
      this.setSinger(singer);
    },
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code == ERR_OK) {
          console.log("歌手列表获取完成");
          console.log(res.data.list);
          this.singers = this.normalizeSinger(res.data.list);
          console.log(this.singers);
        }
      });
    },
    normalizeSinger(list) {
      let map = {
        hot: {
          title: "热门",
          items: []
        }
      };
      //将前10位歌手推入
      list.forEach((item, index) => {
        if (index < 10) {
          map.hot.items.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          );
        }
        const key = item.Findex;

        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })
        );
      });

      let hot = [];
      let ret = [];
      for(let key in map){
        let val = map[key];
        if(val.title.match(/[a-zA-Z]/)){
          //只取字母
          ret.push(val)
        } else if(val.title === "热门") {
          hot.push(val)
        }
      }
      ret.sort((a,b)=>{
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret);
    },
    ...mapMutations({
        setSinger: 'SET_SINGER'
      })
  },
  components:{
    listview
  }
};
</script>

<style>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
