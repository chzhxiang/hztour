<template>
  <div class="updataInfoBox">
    <div class="avaterBox">
      <label for="fileUp" class="fileBox"></label>
      <input type="file" id="fileUp" @change="upLoad" v-show="false"/>
      <img src="http://localhost:8080/static/imgs/user/user.jpg" class="avaterImg" id="avaterImg"/>
    </div>
    <div class="userName">
      <span class="txt">昵称：</span><input type="text" v-model="userName"/>
    </div>
    <div class="pwd">
      <span class="txt">密码：</span><input type="password" v-model="pwd"/>
    </div>
    <div class="pwd">
      <span class="txt">确认密码：</span><input type="password" v-model="againPwd"/>
    </div>
    <div class="userName">
      <span class="txt">设置密保：</span><input type="text" v-model="problem"/>
    </div>
    <div class="userName">
      <span class="txt">密保答案：</span><input type="password" v-model="answer"/>
    </div>
    <div class="btnBox">
      <p class="register" @click="updateFn">修改</p>
    </div>
    <!--<createEditor/>-->
  </div>
</template>

<script>

  // import {createEditor} from 'vueditor'
  // import 'vueditor/dist/style/vueditor.min.css'
    export default {
        name: "updata_info",
      data(){
          return{
            userName:'',
            pwd:'',
            againPwd:'',
            problem:'',
            answer:''
          }
      },
      methods:{
        //图片
        upLoad(e) {
          if (e.target.files[0].type !== "image/jpeg" && e.target.files[0].type !== "image/gif" && e.target.files[0].type !== "image/png" && e.target.files[0].type !== "image/bmp") {
            alert("图片格式错误！");
            return;
          }
          ;
          var fileR = new FileReader();
          var filName = e.target.files[0];
          fileR.readAsDataURL(filName);
          fileR.onload=function(){
            document.getElementById('avaterImg').src=fileR.result;
          }
        },
        updateFn(){

        }
      }
    }
</script>

<style scoped>
  .updataInfoBox{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    top: 0px;
    left: 0px;
    background: #fff;
    z-index: 100;
  }
  .avaterImg{
    width: 100px;
    height: 100px;
  }
  .avaterBox{
    text-align: center;
    position: relative;
    margin-top: 50px;
    font-size: 0.875em;
  }
  .fileBox{
    display: block;
    width: 100px;
    height: 100px;
    position: absolute;
    top: 0px;
    left: 50%;
    margin-left: -50px;
    background: transparent;
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
