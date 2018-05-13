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
export default {
 components:{
   mheader,
   tab,
   player
 },
 created () {
  this.$router.replace('/recommend')
  }
}
</script>

<style>
 @import './common/css/base.css';
 *{
 }
</style>
