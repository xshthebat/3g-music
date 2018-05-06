<template>
  <div id="app">
     <mheader></mheader>
     <!-- 选项卡 -->
     <tab></tab>
     <!-- 导航 -->
     <keep-alive>
          <router-view></router-view>
     </keep-alive>
  </div>
</template>

<script>
import mheader from './components/mheader'
import tab from './components/tab'
export default {
 components:{
   mheader,
   tab
 }
}
</script>

<style>
 @import './common/css/base.css';
</style>
