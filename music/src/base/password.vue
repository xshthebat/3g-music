<template>
    <div class="password_box">
        <inputbox :placeholder="placeholder"  @query="query" :ispassword="true" ></inputbox>
        <div class="password_weight" v-show="showweight">
            <p class="password_weight_title">密码强度:</p>
            <div class="pass_weicolor" :class="{colors:color1}"></div>
            <div class="pass_weicolor" :class="{colors:color2}"></div>
            <div class="pass_weicolor" :class="{colors:color3}"></div>
             <p class="password_weight_p">{{itwiehgts}}</p>
        </div>
    </div>
</template>
<script>
import inputbox from "../base/inputbox";
import password from "../common/js/password.js";
export default {
    data(){
        return{
            querys:'',
            weight:undefined,
            color1:false,
            color2:false,
            color3:false
        }
    },
    props:{
        placeholder:{
            type:String,
            default:''
        },
        show:{
            type:Boolean,
            default:false
        }
    },
    methods:{
        query(newval){
            this.querys = newval;
            this.$emit('query',newval);
        }
    },
    computed:{
        showweight(){
            // console.log(this.show,this.querys)
            return this.show&&this.querys;
        },
        itwiehgts(){
            switch(this.weight){
            case "weak":
            this.color1=true,
            this.color2=false,
            this.color3=false
                return "弱";
                break;
            case "medium":
            this.color1=true,
            this.color2=true,
            this.color3=false
                return "中";
                break;
            case "strong":
            this.color1=true,
            this.color2=true,
            this.color3=true
                return "强";
                break;
            default:
            this.color1=false,
            this.color2=false,
            this.color3=false
                return "";
            }
        }
    },
    watch:{
        querys(newval){
            this.weight = password(newval);
            console.log(this.weight);
        }
    },
    components:{
        inputbox
    }
}
</script>
<style>
.password_weight{
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 5px 0;
}
.pass_weicolor,.password_weight_p,.password_weight_title{
    display: inline-block;
}
.password_weight_p{
    flex:0 1 16px;
}
.pass_weicolor{
    width: 40px;
    height: 12px;
    border:1px solid #000;
}
.colors{
    background-color: #31c27c;
}
</style>
