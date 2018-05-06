<template>
  <div class="song-list">
      <ul>
          <li v-for="(song,index) in songs" class="songitem">
            <!-- <div class="rank" v-if="rank">
                <span :class="getRankCls(index)">{{getRankText(index)}}</span>
            </div> -->
             <div class="content">
                 <h2 class="songname">{{song.name}}</h2>
                 <p class="desc">{{getDesc(song)}}</p>
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
  },
  methods: {
    getDesc(song) {
      return `${song.singer} - ${song.album}`;
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
.desc{
    margin-top: 4px;
    color: rgba(255, 255, 255, 0.3);
}
</style>
