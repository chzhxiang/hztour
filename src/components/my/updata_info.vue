<template>
  <div class="updataInfoBox">
    <div class="backBox">
      <img src="http://localhost:8080/static/icon/back.png" class="backIcon" @click="backFn"/>
      <p class="myTravelsTitle">修改个人信息</p>
    </div>
    <div class="contentBox">
      <div class="nav">
        <div class="l">
          <span @click="baseFn" ref="baseTxt">修改基本信息</span>
        </div>
        <div class="r">
          <span @click="pwdFn" ref="pwdTxt">修改密码</span>
        </div>
      </div>
      <div>
        <div v-show="baseInfo">
          <div class="avaterBox">
            <label for="fileUp" class="fileBox"></label>
            <input type="file" id="fileUp" @change="upLoad" v-show="false"/>
            <img :src="userImg?userImg:'http://localhost:8080/static/imgs/user/user.jpg'" class="avaterImg" id="avaterImg"/>
          </div>
          <div class="userName">
            <span class="txt">昵称：</span><input type="text" v-model="userName"/>
          </div>
          <div class="btnBox">
            <p class="register" @click="updateBaseFn">修改</p>
          </div>
        </div>
        <div v-show="pwdInfo">
          <div class="pwd">
            <span class="txt">旧密码：</span><input type="password" v-model="pwd"/>
          </div>
          <div class="pwd">
            <span class="txt">新密码：</span><input type="password" v-model="npwd"/>
          </div>
          <div class="pwd">
            <span class="txt">确认密码：</span><input type="password" v-model="againPwd"/>
          </div>
          <div class="btnBox">
            <p class="register" @click="updatePwdFn">修改</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import utils from "utility";
  import axios from "axios";
    export default {
        name: "updata_info",
      data(){
          return{
            userName:'',
            userImg:'',
            id:'',
            npwd:'',
            pwd:'',
            againPwd:'',
            baseInfo:true,
            pwdInfo:false,
            flag:''
          }
      },
      created(){
        if(JSON.parse(window.localStorage.getItem("userInfo")).length>0){
          this.userName=JSON.parse(window.localStorage.getItem("userInfo"))[0].userName;
          this.userImg=JSON.parse(window.localStorage.getItem("userInfo"))[0].avatar;
          this.id=JSON.parse(window.localStorage.getItem("userInfo"))[0].id;
          this.flag=JSON.parse(window.localStorage.getItem("userInfo"))[0].flag;
          console.log(this.id);
          // document.getElementById('avaterImg').src=this.userImg;
        }else {
          alert("您还未登录，请先登录！");
          this.$router.push('/my/login');
        }
      },
      methods:{
        //图片
        upLoad(e) {
          if (e.target.files[0].type !== "image/jpeg" && e.target.files[0].type !== "image/gif" && e.target.files[0].type !== "image/png" && e.target.files[0].type !== "image/bmp") {
            alert("图片格式错误！");
            return;
          };
          // this.upTx();
          var fileR = new FileReader();
          var filName = e.target.files[0];
          fileR.readAsDataURL(filName);
          fileR.onload=function(){
            document.getElementById('avaterImg').src=fileR.result;
            // this.userImg=fileR.result;
            let form = new FormData();
            console.log('imgFlag');
            const config = {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            };
            // console.log(this.userName);
            form.append('imgName',JSON.parse(window.localStorage.getItem("userInfo"))[0].flag);
            form.append('name', this.userName);
            form.append("file", document.getElementById('fileUp').files[0]);
            axios.post("/user/upload", form, config).then((res) => {
              console.log("修改图片");
              console.log(res.data);
              if (res.data.code === 1){
                alert('图片修改失败,请重试！');
                return;
              } else {
                alert('图片修改成功！');
                return;
              }
            })
          }
        },
        backFn(){
          window.history.back();
        },
        //修改基本信息
        baseFn(){
          this.baseInfo=true;
          this.pwdInfo=false;
          this.$refs.baseTxt.style.color="skyblue";
          this.$refs.pwdTxt.style.color="#666";
        },
        updateBaseFn(){
          console.log(document.getElementById('fileUp').files[0]);
          if(!this.userName.trim()){
            alert('昵称不能为空！');
            return;
          }
          axios.post('/user/upBaseInfo', {
            userName:JSON.parse(window.localStorage.getItem("userInfo"))[0].userName,
            nUserName:this.userName,
            _id:this.id
          }).then((res) => {
            console.log(res.data);
            if (res.data.code === 1) {
              alert(res.data.msg);
              return;
            } else {
              alert('修改成功！');
              this.$router.push("/my/login");
            }
          });
        },
        //修改头像
        upTx(){
          let form = new FormData();
          // console.log(imgFlag);
          const config = {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          };
          form.append('flag',this.flag);
          form.append('name', this.userName);
          form.append("file", document.getElementById('fileUp').files[0]);
          axios.post("/user/reUpload", form, config).then((res) => {
            console.log(res.data);
            if (res.data.code === 1) {
              alert('修改失败,请重试！');
              return;
            } else {
              alert('修改成功！');
              // this.$router.push('/my/login');
              // this.setIsLogin(true);
              // this.setIsRegister(false);
              return;
            }
          })
        },
        //修改密码
        pwdFn(){
          this.baseInfo=false;
          this.pwdInfo=true;
          this.$refs.baseTxt.style.color="#666";
          this.$refs.pwdTxt.style.color="skyblue";
        },
        updatePwdFn(){
          if(!this.pwd||!this.npwd||!this.againPwd){
            alert("请完善您的信息！");
            return;
          }
          if(this.npwd!==this.againPwd){
            alert("两次密码不一致！");
            return;
          }
          if(this.npwd===this.pwd){
            alert("新密码和旧密码不能一致！");
            return;
          }
          axios.post("/user/upPwd",{
            _id:JSON.parse(window.localStorage.getItem("userInfo"))[0].id,
            pwd:this.md5Pwd(this.md5Pwd(this.pwd)),
            npwd:this.md5Pwd(this.md5Pwd(this.againPwd))
          }).then((res)=>{
            console.log(res.data);
            alert(res.data.msg);
            if(res.data.code===0){
              this.npwd='';
              this.pwd='';
              this.againPwd='';
              this.$router.push("/my/login");
            }else {

            }
          })
        },
        //加密
        md5Pwd(pwd) {
          const salt="C~·`!h@i# $传%3……12^&ks*89（m)-{:+=.,_|?><;fgf";
          return utils.md5(utils.md5(salt+pwd+salt));
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
  .contentBox{
    margin-top: 10px;
    overflow: hidden;
  }
  .nav{
    padding: 10px 0px;
    overflow: hidden;
  }
  .nav div{
    text-align: center;
    width: 50%;
    float: left;
    position: relative;
  }
  .l::after{
    content: '';
    display: block;
    width: 1px;
    height: 100%;
    position: absolute;
    top: 0px;
    right: 0px;
    background: #999;
  }
  .l{
    color: skyblue;
  }
  .r{
    color: #666;
  }
  .backIcon{
    height:1.6em;
    margin:5px 0px 0px 0px;
    position:relative;
    z-index:10;
  }
  .myTravelsTitle{
    position: absolute;
    top: 5px;
    left: 0px;
    text-align: center;
    width: 100%;
    font-size: 1.2em;
    color: #333;
  }
  .avaterImg{
    width: 100px;
    height: 100px;
  }
  .avaterBox{
    text-align: center;
    position: relative;
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
