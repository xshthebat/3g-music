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
  </div>
</template>

<script>
import mheader from './components/mheader'
import tab from './components/tab'
import player from './components/player'
import store from './common/js/store.js';
export default {
 components:{
   mheader,
   tab,
   player
 },
 created () {
 let histroylook = store.getstore.getlookhistory()?`/${store.getstore.getlookhistory()}`:'/recommend';
  this.$router.replace(histroylook)
  }
}
</script>

<style>
 @import './common/css/base.css';
 *{
 }
</style>
