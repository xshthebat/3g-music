<template>
  <div class="loading">
    <img width="24" height="24" src="../common/image/loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>
<script>
export default {
   props: {
      title: {
        type: String,
        default: '加载中...'
      }
    }
}
</script>
<style>
 .loading{
    width: 100%;
    text-align: center;
 }
 .desc{
    line-height: 20px;
    font-size: 12px;
    color: #000;
    /* color: rgba(255, 255, 255, 0.5); */
    }
</style>
