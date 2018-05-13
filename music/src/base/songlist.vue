<template>
  <div class="song-list">
      <ul>
          <li v-for="(song,index) in songs" class="songitem" @click="selectItem(song,index)">
            <!-- <div class="rank" v-if="rank">
                <span :class="getRankCls(index)">{{getRankText(index)}}</span> //rank排名待写
            </div> -->
             <div class="content">
                 <h2 class="songname">{{song.name}}</h2>
                 <p class="songdesc">{{getDesc(song)}}</p>
            </div>
          </li>
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
  created(){
      console.log(this.songs);
      console.log(this.rank);
  },
  methods: {
    getDesc(song) {
      return `${song.singer} - ${song.album}`;
    },
    selectItem(song,index){
      this.$emit('select',song,index);
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
  font-size:14px;
  border-bottom:1px #00000024 solid; 
}
.content{
    flex: 1;
        line-height :20px;
        overflow: hidden;
}
.songimage{
    position: absolute;
    width: 64px;
    height: 64px;
}
.songname{
    color:#000;
}
.songdesc{
    margin-top: 4px;
    color: #008000a8;
}
</style>
