<template>
  <div class="infoBox">
    <div class="userInfo">
      <p class="userInfoLeft">
        <img :src="userImg?userImg:'http://localhost:8080/static/imgs/user/user.jpg'" class="userImg"/>
      </p>
      <p class="userInfoRight">
        <span @click="goLogin">{{userName?userName:'登录'}}</span>
        <span @click="updateInfo">{{userName?'修改个人信息':''}}</span>
      </p>
    </div>
    <div class="operation">
      <p  @click="goWriteTravels"><img src="http://localhost:8080/static/icon/edit.png"/>写游记</p>
      <p @click="myTravels"><img src="http://localhost:8080/static/icon/myEdit.png"/>我的游记</p>
      <p @click="collectionFn"><img src="http://localhost:8080/static/icon/collection.png"/>我的收藏</p>
      <p @click="followFn"><img src="http://localhost:8080/static/icon/follow.png"/>我的关注</p>
	    <p @click="serverFn"><img src="http://localhost:8080/static/icon/server.png"/>联系客服<span>{{msgNum}}</span></p>
      <p class="out" @click="outLoginFn">退出登录</p>
    </div>
  </div>
</template>

<script>
  import {mapGetters,mapMutations} from "vuex";
  import axios from "axios";
  import Io from "socket.io-client";
  const socket=Io('ws://localhost:9090');
  socket.on("recvmsg",(data)=>{
    console.log(data);
  });
    export default {
        name: "my",
      data(){
          return{
            userImg:'',
            userName:'',
            msgNum:0
          }
      },
      created(){
        if(window.localStorage.getItem("userInfo")){
          this.userName=JSON.parse(window.localStorage.getItem("userInfo"))[0].userName;
          this.userImg=JSON.parse(window.localStorage.getItem("userInfo"))[0].avatar;
        }
      },
      activated(){
        if(window.localStorage.getItem("userInfo")){
          axios.post("/chat/selTR",{
            to:JSON.parse(window.localStorage.getItem("userInfo"))[0].id,
            readFlag:false
          }).then((res)=>{
            if(res.data.code===0){
              this.msgNum=res.data.data.length;
            }
          })
        }
      },
      computed:{
        ...mapGetters(['loginSuccess'])
      },
      methods:{
        goLogin(){
          if(!this.userName){
            this.$router.push('/my/login');
          }
        },
        //修改个人信息
        updateInfo(){
          if(this.userName){
            this.$router.push('/my/updataInfo');
          }
        },
        //收藏
        collectionFn(){
          if(!this.userName){
            return;
          }
          this.$router.push("/my/collection");
        },
        //关注
        followFn(){
          if(!this.userName){
            return;
          }
          this.$router.push("/my/attention");
        },
		    serverFn(){
          axios.post("/chat/upd",{
            to:JSON.parse(window.localStorage.getItem("userInfo"))[0].id,
            readFlag:true
          }).then((res)=>{
            this.msgNum=0;
          })
          if(this.userName){
            this.$router.push("/my/server_chat");
          }
		    },
        //写游记
        goWriteTravels(){
          if(this.userName) {
            this.setWriteTravels(true);
            this.$router.push('/my/writeTravels');
          }
        },
        //我的游记
        myTravels(){
          if(!this.userName){
            return;
          }
          this.$router.push("/my/myTravels");
        },
        outLoginFn(){
          window.localStorage.setItem("userInfo",'');
          this.userImg='';
          this.userName='';
          this.setLoginSuccess(false);
        },
        ...mapMutations({
          setLoginSuccess:"SET_LOGINSUCCESS",
          setWriteTravels:"SET_WRITETRAVELS"
        })
      },
      watch:{
        loginSuccess(){
          // console.log('loginsuccess');
          if(window.localStorage.getItem("userInfo")){
            this.userName=JSON.parse(window.localStorage.getItem("userInfo"))[0].userName;
            this.userImg=JSON.parse(window.localStorage.getItem("userInfo"))[0].avatar;
          }
        }
      }
    }
</script>

<style scoped lang="stylus">
  .operation>p>span{
    display block;
    padding 2px 5px;
    border-radius 50%;
    background skyblue;
    color #fff;
    position absolute;
    top:2px;
    text-align center;
    line-height 18px;
    left 80px;
  }
  .infoBox
    background #f5f5f5
    height 100%
    font-size 0.875em
    .userInfo
      padding 10px 5px
      background #fff
      box-shadow 0 0 1px 1px #ccc
      overflow hidden
      p
        padding-left 5px
      .userInfoLeft
        float left
        .userImg
          width 60px
          height 60px
          display inline-block
          border-radius 50%
      .userInfoRight
        float left
        line-height 30px
        span
          display block
  .operation
    p
      padding 10px 5px
      background #fff
      box-shadow 0 0 1px 1px #ccc
      overflow hidden
      position relative
      img
        margin 0px 5px 0px 0px;
        transform translateY(2px);
    .out
      text-align center
      position fixed
      left 0px
      bottom 0px
      margin 0px
      padding 10px 0px
      width 100%
      background skyblue
      color #fff
</style>
