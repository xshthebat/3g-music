<template>
 <transition name="slide">
  <musiclist class="singer-detail" :title ="title" :bgImage="bgImage" :songs="songs"></musiclist>
 </transition>
</template>
<script>
import { mapGetters } from "vuex";
import { getSingerDetail } from "../api/singer";
import { ERR_OK } from "../api/config";
import {createSong} from '../common/js/song';
import musiclist from '../components/musiclist'; 
export default {
  data() {
    return {
      songs: []
    };
  },
  created() {
    this._getDetail();
    console.log(this.singer);
  },
  computed: {
    title(){
      return this.singer.name;
    },
    bgImage () {
        return this.singer.avatar
    },
    ...mapGetters(["singer"])
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push("/singer");
        //判断是否有singer值
        return;
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalLizeSongs(res.data.list);
          console.log(this.songs);
        }
      });
    },
    _normalLizeSongs(list){
        let ret = [];
        list.forEach(item => {
            let {musicData} = item;
            if(musicData.songid&&musicData.albummid){
                ret.push(createSong(musicData));
            }
        });
        return ret;
    }
  },
  components:{
    musiclist
  }
};
</script>
<style >
.singer-detail {
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  background: #fff;
  width: 100vw;
  height: 100vh;
}
.slide-enter-active, .slide-leave-active{
  transition:all .3s;
}
.slide-enter, .slide-leave-to{
   transform:translate3d(100%, 0, 0);
}
</style>
