<template>
  <div class="forgetBox">
    <div>
      <img src="http://localhost:8080/static/icon/back.png" class="backIcon" @click="backFn"/>
      <p class="myTravelsTitle">忘记密码</p>
    </div>
    <div class="userName">
      <span class="txt">昵称：</span><input type="text" v-model="forgetName"/>
    </div>
    <div class="userName" v-if="!forgetReset">
      <span class="txt">密保：</span><input type="text" v-model="forgetProblem"/>
    </div>
    <div class="userName" v-if="!forgetReset">
      <span class="txt">答案：</span><input type="password" v-model="forgetAnswer"/>
    </div>
    <div class="userName" v-if="forgetReset">
      <span class="txt">重置密码：</span><input type="password" v-model="forgetPwd"/>
    </div>
    <div class="userName" v-if="forgetReset">
      <span class="txt">确认密码：</span><input type="password" v-model="forgetAgainPwd"/>
    </div>
    <div class="btnBox" v-if="!forgetReset">
      <p class="register" @click="forgetFn">确定</p>
    </div>
    <div class="btnBox" v-if="forgetReset">
      <p class="register" @click="resetFn">保存新密码</p>
    </div>
  </div>
</template>

<script>
  //axios
  import axios from "axios";
  //utility
  import utils from "utility";
  //vuex
  import {mapMutations} from "vuex";
    export default {
        name: "forget_pwd",
      data(){
          return{
            forgetName:'',
            forgetPwd:'',
            forgetAgainPwd:'',
            forgetProblem:'',
            forgetAnswer:'',
            forgetReset:false
          }
      },
      methods:{
          //密保
        forgetFn(){
          axios.post("/user/forget",{
            userName:this.forgetName,
            problem:this.forgetProblem,
            answer:this.forgetAnswer
          }).then((res)=>{
            if(res.data.code===0){
              alert('操作成功，请重置密码！');
              this.forgetReset=true;
            }else {
              alert(res.data.msg);
              return;
            }
          })
        },
        //重置密码
        resetFn(){
          if(!this.forgetName===''||this.forgetPwd===''||this.forgetAgainPwd===''){
            alert('请完善您的信息！');
            return;
          }
          if(this.forgetPwd!==this.forgetAgainPwd){
            alert('密码不一致！');
            return;
          }
          axios.post("/user/forgetup",{
            userName:this.forgetName,
            pwd:this.md5Pwd(this.md5Pwd(this.forgetPwd))
          }).then((res)=>{
            if(res.data.code===1){
              alert(res.data.msg);
              return;
            }else {
              alert('修改成功！');
              this.$router.push('/my/login');
              return;
            }
            console.log(res.data);
          })
        },
        backFn(){
          this.$router.push("/my/login");
        },
        //加密
        md5Pwd(pwd) {
          const salt="C~·`!h@i# $传%3……12^&ks*89（m)-{:+=.,_|?><;fgf";
          return utils.md5(utils.md5(salt+pwd+salt));
        },
        ...mapMutations({

        })
      }
    }
</script>

<style scoped>
  .forgetBox{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    overflow: hidden;
    background: #fff;
    z-index: 100;
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
    border: 0.05em solid skyblue;
    padding: 5px;
    border-radius: 4px;
    text-align: center;
    background: skyblue;
  }
  .btnBox p.register{
    color: #fff;
  }
  .txt{
    display: inline-block;
    width: 70px;
    text-align: right;
  }
</style>
