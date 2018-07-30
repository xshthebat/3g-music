<template>
  <div id="app">
     <mheader></mheader>
     <!-- 选项卡 -->
     <tab></tab>
     <!-- 导航 -->
     <keep-alive>
          <router-view></router-view>
     </keep-alive>
     <player></player>
     <loading :title="`登陆验证中`" class="loadings" v-show="ok"></loading>
  </div>
</template>

<script>
import mheader from './components/mheader'
import tab from './components/tab'
import player from './components/player'
import store from './common/js/store.js';
import { mapGetters,mapMutations,mapActions} from "vuex";
import loading from "./base/loading"; 
export default {
 components:{
   mheader,
   tab,
   player,
   loading
 },
 data(){
   return {
     stop:false,
     ok:true
   }
 },
 created () {
 let histroylook = store.getstore.getlookhistory()?`/${store.getstore.getlookhistory()}`:'/recommend';
  this.$router.replace(histroylook)
 },
 mounted(){
   this.checklogins().then((res)=>{
     console.log(res);
     this.ok = false;
   });
    let m = document.querySelector('#app');
    m.addEventListener('touchend',this.firstPlay);
 },
 methods:{
   firstPlay(){
    //  alert('touched');
    //  console.log('first play');
     let music = document.querySelector('#music-aduio');
     setTimeout(()=>{
      //  console.log(music.src);
       music.play();
       if(this.playing){
      this.stop = true;
    }
     },0)
   },
   ...mapActions(["checklogins"])
 },
 watch: {
    stop () {
      let m = document.querySelector('#app')
      m.removeEventListener('touchend', this.firstPlay)
    }
  },
  computed:{
     ...mapGetters([
      "playing"
    ])
  }

}
</script>

<style>
 @import './common/css/base.css';
#app {
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.loadings{
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
}
body{
  font-size:62.5;
}
</style>
