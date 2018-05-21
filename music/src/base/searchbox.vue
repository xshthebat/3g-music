<template>
    <div class="search-box">
        <i class="icon-search"></i>
        <input type="text" class="search-input" ref="queryRef" v-model="query" :placeholder="placeholder">
        <i class="icon-dismiss" v-show="query" @click="clearQuery"></i>
    </div>
</template>
<script>
import {debounce} from "../common/js/util.js"
export default {
  data() {
    return {
      query: ""
    };
  },
  props: {
    placeholder: {
      type: String,
      default: "搜索歌曲、歌手"
    }
  },
  methods:{
      clearQuery(){
          this.query = '';
      },
      blur(){
          this.$refs.queryRef.blur();
      },
      getQuery(k){
          this.query = k;
      }
  },
  created(){
      this.$watch('query',debounce((newQuery)=>{
          this.$emit('queryover',newQuery)
      },300))
  }
};
</script>
<style>
.search-box{
    display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  border-radius: 6px;
  background-color: #fff;
}
.icon-search{
    width: 20px;
    height: 20px;
    background-image: url(../common/image/icon-search.svg);
}
.search-input{
    flex: 1;
    margin: 0 5px;
    line-height: 20px;
    border: 0;
    outline: none;
}
.icon-dismiss{
     width: 20px;
    height: 20px;
    background-image: url(../common/image/icon-dismiss.svg);
}
</style>
