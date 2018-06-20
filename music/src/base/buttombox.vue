<template>
    <div class="box-button">
        <button class="submit-button" :class="{btndisabled:disabled}" @click="btnclick">{{button}}</button>
    </div>
</template>
<script>
export default {
    data(){
        return{
        }
    },
    props:{
        disabled:{
            type:Boolean,
            default:true
        },
        button:{
            type:String,
            default:"button"
        }
    },
    methods:{
        btnclick(){
            if(this.disabled){
                return;
            }
            this.$emit("submit");
        }
    }
}
</script>
<style>
.box-button{
        text-align: center;
}
.submit-button{
     width: 70%;
    margin-top: 16px;
    appearance: none;
    background-color: #31c27c;
    border: 0;
    height: 45px;
    line-height: 45px;
    border-radius: 5px;
    font-size: 18px;
    color: #fff;
}
.btndisabled{
    opacity: 0.5;
}
</style>
