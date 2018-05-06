<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">3G music</h1>
  </div>
</template>
<script>
export default {}
</script>
<style>
.m-header{
  height: 44px;
  position: relative;
  flex-direction: row;
  text-align: center;
  background-color:#31c27c;
  display: flex;
  color: #fff;
  justify-content:center;
  align-items:center;
}
.icon{
  display: inline-block;
  height: 32px;
  width: 32px;
  background-image:url('./../common/image/icon.png');
  margin-right: 9px;
}
.text{
  line-height: 44px;
  font-size: 18px;
}
</style>
