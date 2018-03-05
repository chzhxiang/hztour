<template>
  <div id="app">
    <travels-detail></travels-detail>
    <hz-header/>
    <tab/>
    <!--<rigster v-if="isRegister"/>-->
    <!--<Login v-show="isLogin"/>-->
    <!--<ForgetPwd v-if="isForgetPwd"/>-->
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
  import {tourData} from "@/data/data";
  //头
  import HzHeader from "@/base/hz_header/hz_header";
  //导航
  import Tab from "@/base/tab/tab";
  //登录
  import Login from "@/components/my/login";
  //注册
  import Rigster from "@/components/my/rigster";
  //忘记密码
  import ForgetPwd from "@/components/my/forget_pwd";
  //vuex
  import {mapGetters} from "vuex";
  import TravelsDetail from "@/components/travels/travels_detail";
export default {
  name: 'App',
  data(){
    return {
      deatList:""
    }
  },
  components:{
    HzHeader,
    Tab,
    Login,
    Rigster,
    ForgetPwd,
    TravelsDetail
  },
  created(){
    this.deatList=tourData;
  },
  mounted(){
  },
  computed:{
    ...mapGetters([])
  },
  methods:{

  }
}
</script>

<style>
  #app {
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    overflow: hidden;
    font-size: 0.875em;
  }
  body,html{
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    overflow: hidden;
  }
  html,body,div,ul,li,ol,input,span,a,p,img,h1,h2,h3,h4,h5,h6,form,dl,dt,textarea,i,s,b,u,nav,header,section{
    margin:0;
    padding:0;
    box-sizing: border-box;
    -webkit-box-sizing:border-box;
  }
  input,textarea{
    border:none;
    outline-style: none;
    outline:none;
    resize:none;
    -webkit-appearance: none;
  }
  ul,li{
    list-style: none;
  }
  i,s,b,u{
    text-decoration: none;
    font-style: normal;
    font-weight: normal;
  }
  a{
    color:#333;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }
</style>
