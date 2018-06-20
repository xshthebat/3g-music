<template>
     <div v-show="vercodesvg" class="ver-box">
        <input type="text" class="vercode-input" ref="vercodeRef" v-model="vercode" :placeholder="vercodeplaceholder" maxlength="4">
        <i class="login-dismiss" v-show="vercode" @click="clearvercode"></i>
        <div class="vercode" ref="vercode" v-html="vercodesvg" v-show="show" @click="getvercodes"></div>
        <div class="vercode" v-show="!show"><p>请等待刷新</p></div>
    </div>
</template>
<script>
import {getvercode} from "../api/getvercode.js";
export default {
    data(){
        return{
            vercode:"",
            vercodesvg:"",
            show:true
        }
    },
    watch:{
        show(newval){
            console.log(newval);
        }
    },
    props:{
        vercodeplaceholder:{
            type:String,
            default:""
        }
    },
    methods:{
        clearvercode(){
            this.vercode = "";
        },
        getvercodes(){
            this.clearvercode();
            getvercode().then((res)=>{
                if(res.err){
                  this.$emit("errs",res.err);
                } else{
                  this.$emit("get");
                  this.vercodesvg = res.data;
                }
            })
        }
    },
    watch:{
        vercode(newval){
             this.$emit("vercodes",newval);
        }
    }
}
</script>
<style>
.ver-box{
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 0 0 6px;
  height: 40px;
  position: relative;
  justify-content:space-between;
  margin-bottom: 10px;
}
.ver-box:after {
  content: "  ";
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 100%;
  height: 1px;
  background-color: red;
  /* 如果不用 background-color, 使用 border-top:1px solid #f00; 效果是一样的*/
  transform: scaleY(0.5);
}
.vercode-input{
    margin: 0 5px;
    line-height: 20px;
    border: 0;
    outline: none;
    width: 50%;
}
.login-dismiss {
  width: 20px;
  height: 20px;
  background-image: url(../common/image/icon-dismiss.svg);
}
</style>
