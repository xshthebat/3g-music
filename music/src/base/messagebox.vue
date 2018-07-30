<template>
    <div class="messagebox-wrap" :class="{'acolor':color}">
    <div class="messagebox" @touchstart="changecolor" @touchend="click" >
        <p class="messagename">{{messagename}}</p>
        <div class="main-wrapper">
            <p class="messagemain">{{messagemain}}</p>
        </div>
        <i class="messsagechange"></i>
    </div>
    </div>
</template>
<script>
export default {
    props:{
        messagename:{
            type:String,
            default:'表项'
        },
        messagemain:{
            type:String,
            default:'内容'
        }
    },
    data(){
        return {
            color:false
        }
    },
    methods:{
        changecolor(){
            this.color = true;
        },
        click(){
            this.color = false;
            this.$emit('messagechange',{key:this.messagename,val:this.messagemain});
        }
    }
}
</script>
<style>
.messsagechange {
  background-image: url(../common/image/messagechange.svg);
  height: 20px;
  width: 20px;
  padding: 10px;
  margin-right: 5px;
  background-repeat: no-repeat;
  background-position: 10px 10px;
}
.messagebox-wrap{
    width: 100%;
    padding-left:20px; 
    border-radius: 2%;
}
.messagebox > p {
  font-size: 16px;
  line-height: 16px;
}
.acolor{
    position: relative;
    background-color:#0000001a;
}
.acolor>div::after{
     content: " ";
  position: absolute;
  left: 0;
  bottom: 0px;
  width: 100%;
 background-color: #fff;
}
.messagebox {
  width: 100%;
  height: 52px;
  /* background-color: #fff; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.messagename {
  margin-left: 15px;
}
.messagemain {
  /* margin-right: 20px; */
  position: absolute;
  right: 40px;
}
.messagebox:after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0px;
  width: 100%;
  height: 1px;
  background-color: #000;
  -webkit-transform: scaleY(0.3);
  transform: scaleY(0.3);
}
.main-wrapper{
    height:16px;
}
</style>
