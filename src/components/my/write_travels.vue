<template>
    <div class="writeTravelsBox">
      <!--<quillEditor/>-->
      <div>
        <img src="http://localhost:8080/static/icon/back.png" class="backIcon" @click="backFn"/>
        <p class="myTravelsTitle">写游记</p>
      </div>
      <scroll class="editScroll" v-bind:style="{height:(h-30)+'px'}">
        <div>
          <div class="edtiBoxTop">
            <form>
              <p>
                <span class="editTitle">标题：</span>
                <input type="text" name="essay" class="edtiEssay" v-model="editTitle"/>
              </p>
              <span style="font-size: 1em;">内容：</span><br/>
              <textarea class="essayTxt" v-model="editContent"></textarea>
              <label for="turismPicture" class="essayPicture">+</label>
              <input type="file" name="turismPicture" id="turismPicture" class="essayPictureFile" @change="upImgFn"/>
            </form>
            <div id="imgBox" style="overflow: hidden;">

            </div>
          </div>
          <div class="edtiBoxBottom">
            <p class="left" @click="resetFn">重置</p>
            <p class="right" @click="travelsSubmit">上传</p>
          </div>
        </div>
      </scroll>
    </div>
</template>

<script>
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import {quillEditor} from 'vue-quill-editor'
  //axios
  import axios from "axios";
  //scroll
  import Scroll from "@/base/scroll/scroll";
    export default {
        name: "write_travels",
      data(){
          return{
            editTitle:'',
            editContent:'',
            userName:'',
            imgs:'',
            imgFlag:'',
            h:0
          }
      },
      created(){
          this.h=window.screen.height;
          console.log(this.h);
          console.log('name');
          console.log(JSON.parse(window.localStorage.getItem("userInfo")).length>0);
          console.log(JSON.parse(window.localStorage.getItem("userInfo"))[0].userName);
        if(JSON.parse(window.localStorage.getItem("userInfo")).length>0){
          this.userName=JSON.parse(window.localStorage.getItem("userInfo"))[0].userName;
          this.imgFlag=this.userName+''+new Date().getFullYear()+'-'+new Date().getMonth()+'-'+new Date().getDate()+' '+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()+' '+Math.random()+' '+Math.random();
          console.log(this.imgFlag);
        }else {
          alert('您的状态未登录状态，请前往登录！');
          return;
        }
      },
      components:{
        quillEditor,
        Scroll
      },
      methods:{
          //上传图片
        upImgFn(e){
          // console.log("this.userName");
          // console.log(this.userName);
          // console.log(this.imgFlag==='');
          // console.log("this.imgFlag");
          // console.log(this.imgFlag);
          if (e.target.files[0].type !== "image/jpeg" && e.target.files[0].type !== "image/gif" && e.target.files[0].type !== "image/png" && e.target.files[0].type !== "image/bmp") {
            alert("图片格式错误！");
            return;
          };
          let imgff=this.imgFlag;
          var fileR = new FileReader();
          var filName = e.target.files[0];
          fileR.readAsDataURL(filName);
          fileR.onload=function(){
            // document.getElementById('avaterImg').src=fileR.result;
            this.imgs="<div style='width: 100px;height: 100px;float: left;overflow: hidden;margin: 10px;line-height: 100px;'><img src='"+fileR.result+"' style='height: 100px;'/></div>";
            document.getElementById('imgBox').innerHTML=document.getElementById('imgBox').innerHTML+this.imgs;
            let form = new FormData();
            const config = {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            };

            // if(this.imgFlag){
            //   console.log(8347837483);
            //   this.imgFlag=this.userName+''+new Date().getFullYear()+'-'+new Date().getMonth()+'-'+new Date().getDate()+' '+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()+' '+Math.random()+' '+Math.random();
            // }
            console.log(imgff);
            form.append('flag', imgff);
            form.append("file", filName);
            axios.post('/travels/upFile',form,config).then((res)=>{
              console.log('/travels/upFile');
              console.log(res.data);
              if(res.data.code===1){
                alert(res.data.msg);
                return;
              }
            });
          }
        },
        //上传
        travelsSubmit(){
		      console.log(this.imgFlag);
          if(this.editTitle.trim()===''){
            alert('游记标题不能为空！');
            return;
          }
          if(this.editContent.trim()===''){
            alert('游记内容不能为空！');
            return;
          }
          // author,articleName,articleContent,articleImg,articleTime
          let editTime=new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
          //if(!document.getElementById('turismPicture').files[0]){
            //this.imgFlag='';
          //}
          axios.post('/travels/register',{
            author:this.userName,
            articleName:this.editTitle,
            articleContent:this.editContent,
            flag:this.imgFlag,
            articleTime:editTime
          }).then((res)=>{
            console.log(res.data);
            if(res.data.code===1){
              alert(res.data.msg);
              return;
            }else {
              alert('上传成功！');
              this.$router.push("/my");
              this.editTitle='';
              this.editContent='';
              document.getElementById('imgBox').innerHTML='';
              return;
            }
          })
        },
        //重置
        resetFn(){
          this.editTitle='';
          this.editContent='';
          if(document.getElementById('imgBox').innerHTML){
            console.log(this.imgFlag)
            axios.post("/travels/delFile",{
              flag:this.imgFlag
            }).then((res)=>{
              console.log(res.data);
            });
          }
          document.getElementById('imgBox').innerHTML='';
        },
        //返回
        backFn(){
          this.$router.push("/my");
        }
      }
    }
</script>

<style scoped lang="stylus">
  .writeTravelsBox{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    overflow: hidden;
    background: #fff;
    z-index: 100;
    font-size:0.875em;
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
    /*z-index: -1;*/
  }
  .edtiBoxTop
    width 100%
    padding 10px 5px
    box-sizing border-box
    .essayTxt
      outline none
      width 100%
      height 450px
      resize none
      margin 9px 0px
      border 1px solid #ccc
    .essayPictureFile
        display none
    .essayPicture
      width 30px
      height 30px
      border-radius 4px
      background lightskyblue
      color #fff
      display block
      line-height 30px
      text-align center
    .editTitle
      width 10%
      font-size 1em
    .edtiEssay
      outline none
      border none
      border-bottom 1px solid #ccc
      width 80%
  .edtiBoxBottom
    width 200px
    margin 10px auto
    overflow hidden
    p
      width 90px
      height 30px
      text-align center
      line-height 30px
      border 1px solid lightskyblue
      border-radius 4px
    .left
      float left
      color lightskyblue
    .right
      float right
      background lightskyblue
      color #fff
  .editScroll{
    width:100%;
    height:100%;
    overflow:hidden;
  }
</style>
