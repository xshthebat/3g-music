<template>
    <transition name="list-slide">
  </transition>
</template>
<script>
import { mapGetters } from "vuex";
import { getSongList } from "../api/recommend.js";
import musiclist from "../components/musiclist";
import Singer from "../common/js/Singer.js";
export default {
  methods: {
    _getSongList() {
      if (!this.songlist.dissid) {
        this.$router.push("/recommend");
        return;
      }
      getSongList(this.songlist.dissid).then(res => {
        console.log(res);
      });
    }
  },
  created() {
    this._getSongList();
  },
  component: {
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
.rank-slide-leave-to {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
</style>
