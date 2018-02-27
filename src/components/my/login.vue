<template>
    <div class="loginBox">
      <div>
        <img src="http://localhost:8080/static/icon/back.png" class="backIcon" @click="backFn"/>
        <p class="myTravelsTitle">登录</p>
      </div>
      <div class="userName">
        昵称：<input type="text" v-model="loginName"/>
      </div>
      <div class="pwd">
        密码：<input type="password" v-model="loginPwd"/>
      </div>
      <div class="btnBox">
        <p class="login" @click="loginFn">登录</p>
      </div>
      <div>
        <p class="forget" @click="goForget">忘记密码？</p>
        <p class="register" @click="goRegister">没有账户，去注册</p>
      </div>
    </div>
</template>

<script>
  //vuex
  import {mapMutations} from "vuex";
  //utility
  import utils from "utility";
  //axios
  import axios from "axios";
    export default {
        name: "login",
      data(){
          return {
            loginName:"",
            loginPwd:""
          }
      },
      methods:{
        goRegister(){
          this.$router.push('/my/rigster');
          // this.setIsLogin(false);
          // this.setIsRegister(true);
        },
        goForget(){
          this.$router.push('/my/forgetPwd');
          // this.setIsLogin(false);
          // this.setIsForgetPwd(true);
        },
        //登录
        loginFn(){
          if(this.loginName.trim()===''||this.loginPwd===''){
            alert('请完善您的信息!');
            return;
          }
          axios.post("/user/login",{
            userName:this.loginName,
            pwd:this.md5Pwd(this.md5Pwd(this.loginPwd))
          }).then((res)=>{
            // console.log(res.data);
            if(res.data.code===0){
              console.log(67437473);
              console.log(res.data.data[0].avatar);
              if(res.data.data[0].avatar){
                console.log(67437473);
                axios.post("/user/reqAvatar",{
                  img:res.data.data[0].avatar
                }).then((resagain)=>{
                  if(resagain.data.code===0){
                    window.localStorage.setItem("userInfo",JSON.stringify([{
                      userName:this.loginName,
                      avatar:resagain.data.msg.path
                    }]));
                    // console.log(window.localStorage.getItem("userInfo"));
                    alert("登录成功！");
                    this.loginName="";
                    this.loginPwd="";
                    this.$router.push('/my');
                    // this.setIsLogin(false);
                    // this.setIsMy(true);
                  }else {
                    alert('登录失败，请重试！');
                    return;
                  }
                });
              }else {
                alert("登录成功！");
                this.loginName="";
                this.loginPwd="";
                this.$router.push('/my');
                // this.setIsLogin(false);
                // this.setIsMy(true);
              }
              return;
            }else{
              alert(res.data.msg);
              return;
            }
          })
        },
        //加密
        md5Pwd(pwd) {
          const salt="C~·`!h@i# $传%3……12^&ks*89（m)-{:+=.,_|?><;fgf";
          return utils.md5(utils.md5(salt+pwd+salt));
        },
        //返回
        backFn(){
          this.$router.push("/my");
        },
        ...mapMutations({
          setIsLogin:"SET_ISLOGIN",
          setIsRegister:"SET_ISREGISTER",
          setIsMy:"SET_ISMY",
          setIsForgetPwd:"SET_ISFORGETPWD"
        })
      }
    }
</script>

<style scoped>
  .loginBox{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 100;
    background: #fff;
  }
  .backIcon{
    height:1.6em;
    margin:5px 0px 0px 0px;
    position: relative;
    z-index: 10;
  }
  .myTravelsTitle{
    position: absolute;
    top: 5px;
    left: 0px;
    text-align: center;
    width: 100%;
    font-size: 1.2em;
    /*z-index: -1;*/
  }
  .userName,.pwd{
    text-align: center;
    font-size: 1em;
    padding: 10px;
  }
  .userName input,.pwd input{
    border: none;
    border-bottom: 0.05em solid #999;
  }
  .btnBox{
    overflow: hidden;
    width: 200px;
    margin: 0 auto;
  }
  .btnBox p{
    width: 150px;
    border: 0.05em solid skyblue;
    padding: 5px;
    border-radius: 4px;
  }
  .btnBox p.login{
    margin: 0px auto;
    background: skyblue;
    color: #fff;
    text-align: center;
  }
  p.forget{
    float: left;
    color: skyblue;
    padding-left: 5px;
  }
  p.register{
    float: right;
    color: skyblue;
    padding-right: 5px;
  }
</style>
