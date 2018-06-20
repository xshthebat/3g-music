<template>
  <div class="song-list">
      <ul>
          <div v-for="(song,index) in songs" class="songitem" @click="selectItem(song,index)">
            <div class="rank-icon" v-if="rank">
                <span :class="getRankCls(index)">{{getRankText(index)}}</span>
            </div>
             <div class="content">
                 <h2 class="songname">{{song.name}}</h2>
                 <p class="songdesc">{{getDesc(song)}}</p>
            </div>
          </div>
      </ul>
  </div>
</template>
<script>
export default {
  props: {
    songs: {
      type: Array,
      default: []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  created() {
    console.log("是否排行", this.rank);
  },
  methods: {
    getDesc(song) {
      return `${song.singer} - ${song.album}`;
    },
    selectItem(song, index) {
      this.$emit("select", song, index);
    },
    getRankCls(index) {
      if (index === 0) {
        return "top0";
      } else if (index === 1) {
        return "top1";
      } else if (index === 2) {
        return "top2";
      } else {
        return "rank-text";
      }
    },
    getRankText(index) {
      if (index > 2) {
        return index + 1;
      }
    }
  }
};
</script>
<style>
.songitem {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 64px;
  font-size: 14px;
  border-bottom: 1px #00000024 solid;
}
.content {
  flex: 1;
  line-height: 20px;
  overflow: hidden;
}
.songimage {
  position: absolute;
  width: 64px;
  height: 64px;
}
.songname {
  color: #000;
}
.songdesc {
  margin-top: 4px;
  color: #008000a8;
}
.rank-icon {
  flex: 0 0 25px;
  width: 25px;
  margin-right: 10px;
  text-align: center;
}
.rank-text {
  font-size: 20px;
  color: #ff0000;
}
.top0 {
  display: inline-block;
  width: 30px;
  height: 30px;
  background-image: url(../common/image/1.svg);
}
.top1 {
  display: inline-block;
  width: 30px;
  height: 30px;
  background-image: url(../common/image/2.svg);
}
.top2 {
  display: inline-block;
  width: 30px;
  height: 30px;
  background-image: url(../common/image/3.svg);
}
</style>
