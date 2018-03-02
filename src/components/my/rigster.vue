<template>
  <div class="rigsterBox">
    <div class="backBox">
      <img src="http://localhost:8080/static/icon/back.png" class="backIcon" @click="backFn"/>
      <p class="myTravelsTitle">注册</p>
    </div>
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
        <p class="register" @click="registerFn">注册</p>
      </div>
  </div>
</template>

<script>
  //axios
  import axios from "axios";
  //vuex
  import {mapMutations} from "vuex";
  //utility
  import utils from "utility";
    export default {
      name: "rigster",
      data() {
        return {
          userName: '',
          pwd: '',
          againPwd: '',
          problem: '',
          answer: ''
        }
      },
      methods: {
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
        //注册
        registerFn() {
          if (this.userName.trim() === '' || this.pwd === '' || this.againPwd === '' || this.problem === '' || this.answer === '') {
            alert('请完善您的信息！');
            return;
          }
          if (this.pwd !== this.againPwd) {
            alert('密码不一致！');
            return;
          }
          console.log(document.getElementById('fileUp').files[0]);
          let imgFlag=document.getElementById('fileUp').files[0].name+new Date().getFullYear()+'-'+new Date().getMonth()+'-'+new Date().getDay()+'-'+new Date().getHours()+'-'+new Date().getMinutes()+'-'+new Date().getSeconds()+'-'+Math.random();
          // if(!document.getElementById('fileUp').files[0]) {
          //   alert('头像信息未更改，若不需更改则直接注册；若需更改需点击头像显示框更换头像信息，再注册！');
          // }
          axios.post('/user/register', {
            userName: this.userName,
            pwd: this.md5Pwd(this.md5Pwd(this.pwd)),
            avatar: document.getElementById('fileUp').files[0] ? imgFlag : '',
            problem: this.problem,
            answer: this.answer
          }).then((res) => {
            console.log(res.data);
            if (res.data.code === 1) {
              alert(res.data.msg);
              return;
            } else {
              if (document.getElementById('fileUp').files[0]) {
                let form = new FormData();
                console.log(imgFlag);
                const config = {
                  headers: {
                    "Content-Type": "multipart/form-data"
                  }
                };
                console.log(this.userName);
                form.append('imgName',imgFlag);
                form.append('name', this.userName);
                form.append("file", document.getElementById('fileUp').files[0]);
                axios.post("/user/upload", form, config).then((res) => {
                  console.log(res.data);
                  if (res.data.code === 1) {
                    alert('图片上传失败,请重试！');
                    return;
                  } else {
                    alert('注册成功！');
                    this.$router.push('/my/login');
                    // this.setIsLogin(true);
                    // this.setIsRegister(false);
                    return;
                  }
                })
              }
            }
          });
        },
        backFn(){
          this.$router.push("/my/login");
        },
        //加密
        md5Pwd(pwd) {
          const salt = "C~·`!h@i# $传%3……12^&ks*89（m)-{:+=.,_|?><;fgf";
          return utils.md5(utils.md5(salt + pwd + salt));
        },
        ...mapMutations({

        })
      }
    }
</script>

<style scoped>
  .rigsterBox{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #fff;
  }
  .backIcon{
    height:1.6em;
    margin:5px 0px 0px 0px;
    position: relative;
    z-index: 10;
  }
  .myTravelsTitle{
    color: #333;
    position: absolute;
    top: 5px;
    left: 0px;
    text-align: center;
    width: 100%;
    font-size: 1.2em;
    /*z-index: -1;*/
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
