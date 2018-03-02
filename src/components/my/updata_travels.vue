<template>
  <div class="writeTravelsBox">
    <!--<quillEditor/>-->
    <div class="backBox">
      <img src="http://localhost:8080/static/icon/back.png" class="backIcon" @click="backFn"/>
      <p class="myTravelsTitle">编辑</p>
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
            <label for="turismPicture" class="essayPicture" @click="reImg">重新上传图片</label>
            <input type="file" name="turismPicture" id="turismPicture" class="essayPictureFile" @change="upImgFn"/>
          </form>
          <div id="imgBox" style="overflow: hidden;">

          </div>
        </div>
        <div class="edtiBoxBottom">
          <p class="right" @click="travelsSubmit">修改</p>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
  //axios
  import axios from "axios";
  //scroll
  import Scroll from "@/base/scroll/scroll";
  import {mapGetters} from "vuex";
    export default {
        name: "updata_travels",
      data(){
        return{
          editTitle:'',
          editContent:'',
          id:'',
          userName:'',
          imgs:'',
          imgFlag:'',
          h:0,
          delImg:0
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
          this.init();
        }else {
          alert('您的状态未登录状态，请前往登录！');
          return;
        }
      },
      computed:{
        ...mapGetters(['upDataTravels'])
      },
      components:{
        Scroll
      },
      methods:{
        //初始化
        init(){
          this.editTitle=this.upDataTravels.articleName;
          this.editContent=this.upDataTravels.articleContent;
          this.imgFlag=this.upDataTravels.flag;
          this.id=this.upDataTravels._id;
          axios.post("/travels/selTravelsimg",{
            flag:this.upDataTravels.flag
          }).then((res)=>{
            console.log(res.data);
            if(res.data.code===0){
              for(let i=0;i<res.data.data.length;i++){
                console.log(i);
                document.getElementById('imgBox').innerHTML=document.getElementById('imgBox').innerHTML+"<div style='width: 100px;height: 100px;float: left;overflow: hidden;margin: 10px;line-height: 100px;'><img src='"+res.data.data[i].path+"' style='height: 100px;'/></div>";
              }
            }
          })
        },
        //重新上传
        reImg(){
          this.delImg++;
          if(this.delImg>1){
            return;
          }
          document.getElementById('imgBox').innerHTML='';
          //删除原图片
          axios.post("/travels/delFile",{
            flag:this.upDataTravels.flag
          }).then((res)=>{
            console.log(res.data);
          })
        },
        //上传图片
        upImgFn(e){
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
        //修改
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
          if(this.editTitle.trim()===this.upDataTravels.articleName&&this.editContent.trim()===this.upDataTravels.editContent){
            //检测是否修改
          }
          let editTime=new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
          axios.post('/travels/upTravels',{
            _id:this.id,
            articleName:this.editTitle,
            articleContent:this.editContent,
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
        //返回
        backFn(){
          window.history.back();
        }
      },
      watch:{
        upDataTravels(val){
          this.editTitle=val.articleName;
          this.editContent=val.articleContent;
          this.imgFlag=val.flag;
          this.id=val._id;
          axios.post("/travels/selTravelsimg",{
            flag:val.flag
          }).then((res)=>{
            console.log(res.data);
            if(res.data.code===0){
              for(let i=0;i<res.data.data.length;i++){
                console.log(i);
                document.getElementById('imgBox').innerHTML=document.getElementById('imgBox').innerHTML+"<div style='width: 100px;height: 100px;float: left;overflow: hidden;margin: 10px;line-height: 100px;'><img src='"+res.data.data[i].path+"' style='height: 100px;'/></div>";
              }
            }
          })
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
    color:#333;
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
      width 100px
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
