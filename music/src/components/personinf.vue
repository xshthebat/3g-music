<template>
    <div class="personinf">
         <!-- 顶部 -->
        <div class="loginback" @click="back"><i class="back-icon"></i></div>
        <div class="logintitle"><p class="title_p">{{title}}</p></div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            title:'个人信息修改'
        }
    },
    methods:{
        back(){
            this.$router.push('/');
        }
    }
}
</script>
<style>
    .personinf{
        position: fixed;
        top: 0;
        width: 100%;
        bottom: 0;
        background-color: #fff;
    }
    .infback{

    }
</style>
