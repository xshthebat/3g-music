<template>
  <div class="tab">
      <router-link tag="div" class="tab-item" to="/recommend" @click.native="setlookhisttory('recommend')">
      <span class="tab-link">推荐</span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/singer" @click.native="setlookhisttory('singer')">
      <span class="tab-link">歌手</span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/rank" @click.native="setlookhisttory('rank')">
      <span class="tab-link">排行</span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/search" @click.native="setlookhisttory('search')">
      <span class="tab-link">搜索</span>
      </router-link>
  </div>
</template>
<script>
import store from '../common/js/store.js';
export default {
    methods:{
        setlookhisttory(value){
            console.log('路由切换',value);
            store.setstore.setlookhistory(value);
        }
    }
};
</script>

<style>
.tab
{
    display: flex;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
}
.tab-item
{
     flex: 1;
     text-align: center;
     padding-bottom: 2px;
 }
 .tab-link
 {
    color:#333;
 }
.router-link-active 
 {
    border-bottom : peru 2px solid;
 }
</style>
