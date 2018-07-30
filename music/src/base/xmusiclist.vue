<template>
    <div class="xmusiclist">
        <div class="music-title"><p>{{title}}</p></div>
        <scroll :data="turedata" :scrollX="true" class="scroll-wrapper" :click="false" ref="scroll">
        <ul class="musicimgwrapper" ref="list">
            <li v-for="(song,index) in turedata" class="img-itme">
                <img v-lazy="song.image" height="120px" width="120px" class="img-list" @click.stop="select(index)">
            </li>
        </ul>
        </scroll>
    </div>
</template>
<script>
import scroll from "../base/scroll";
import { createSonglist } from "../common/js/song.js";
import { mapGetters, mapMutations, mapActions } from "vuex";
import musiclist from "../components/musiclist";
export default {
  props: {
    data: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: "横向歌单"
    }
  },
  methods: {
    select(index) {
      this.selectPlay({ list: this.turedata, index: index });
    },
    ...mapActions(["selectPlay"])
  },
  data() {
    return {};
  },
  mounted() {
    this.$refs.list.style.width = `${this.turedata.length * 142 + 12}px`;
  },
  computed: {
    turedata() {
      return createSonglist(JSON.parse(JSON.stringify(this.data))).reverse();
    },
    bgImage() {
      let index = Math.floor(Math.random() * this.turedata.length);
      return this.turedata[index].image;
    }
  },
  watch: {
    turedata() {
      this.$refs.scroll.refresh();
      this.$refs.list.style.width = `${this.turedata.length * 142 + 12}px`;
    }
  },
  components: {
    scroll,
    musiclist
  }
};
</script>
<style>
.xmusiclist {
  width: 100%;
  overflow: hidden;
  /* height: 140px; */
  position: relative;
}
.musicimgwrapper {
  /* width: 1000px; */
  height: 140px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.img-itme {
  /* float: left; */
  width: 120px;
  margin: 0 0 0 10px;
  position: relative;
  border: 1px solid #31c27c;
  padding: 5px;
  background-color: #ebebde;
}
.music-title {
  height: 30px;
  position: relative;
}
.music-title > p {
  position: absolute;
  left: 10px;
  top: 10px;
  font-size: 16px;
  color: red;
}
.scroll-wrapper {
  width: 100%;
  overflow: hidden;
  padding-bottom: 10px;
}
.scroll-wrapper::after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0px;
  width: 100%;
  height: 1px;
  background-color: #000;
  transform: scaleY(0.3);
}
</style>
