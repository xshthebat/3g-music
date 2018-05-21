<template>
    <div class="no-sesult">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{ title }}</p>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      tpye: String,
      default: "抱歉,暂无数据"
    }
  }
};
</script>
<style>
.no-sesult {
  text-align: center;
}
.no-result-icon{
    width: 86px;
    height: 86px;
    margin: 0 auto;
    background-size:86px 86px;
    background-image: url(../common/image/lost-data.svg); 
}
.no-result-text {
  margin-top: 30px;
  font-size: 20px;
  color: #000;
}
</style>
