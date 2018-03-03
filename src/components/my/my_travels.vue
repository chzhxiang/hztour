<template>
    <div class="myTravelsBox">
      <div class="backBox">
        <img src="http://localhost:8080/static/icon/back.png" class="backIcon" @click="backFn"/>
        <p class="myTravelsTitle">我的游记</p>
      </div>
      <scroll class="myTravelsScroll">
        <div class="myTravelsContent">
          <div v-for="(item,index) in travelsData" class="travelsItem">
            <p class="travelsItemTitle">
              <span>{{item.articleName}}</span>
              <span>{{item.articleTime}}</span>
            </p>
            <p class="travelsItemContent">{{item.articleContent}}</p>
            <p style="padding: 5px;color: #666;">……</p>
            <p class="operationBox">
              <button @click="delTravels(item,index)">删除</button>
              <button @click="upDataFn(item)">编辑</button>
            </p>
          </div>
        </div>
      </scroll>
      <p class="noBox" v-bind:style="{height:h+'px',lineHeight:h+'px'}" v-show="travelsData.length===0?true:false">您还没有游记哦~</p>
    </div>
</template>

<script>
  import Scroll from "@/base/scroll/scroll";
  //axios
  import axios from "axios";
  import {mapMutations} from "vuex";
    export default {
        name: "my_travels",
      data(){
          return{
            userName:'',
            travelsData:[],
            h:null
          }
      },
      created(){
          this.h=window.screen.height;
        if(JSON.parse(window.localStorage.getItem("userInfo")).length>0){
          this.userName=JSON.parse(window.localStorage.getItem("userInfo"))[0].userName;
          axios.post("/travels/selTravels",{
            author:this.userName
          }).then((res)=>{
            console.log("weweew");
            console.log(res.data);
            if(res.data.code===0){
              if(res.data.data.length>0){
                for(let i=res.data.data.length-1;i>=0;i--){
                  this.travelsData.push(res.data.data[i]);
                }
              }else {

              }
            }
          })
        }else {
          alert("您还未登录，请先登录！");
          this.$router.push("/my");
          return;
        }
      },
      components:{
        Scroll
      },
      methods:{
        backFn(){
          window.history.back();
          // this.$router.push("/my");
        },
        //删除
        delTravels(val,index){
          // console.log(val);
          axios.post("/travels/delTravels",{
            articleName:val.articleName
          }).then((res)=>{
            if(res.data.code===0){
              alert(res.data.msg);
              for(let i=this.travelsData.length-1;i>=0;i--){
                if(i===index){
                  this.travelsData.splice(i,1);
                }
              }
              return;
            }else {
              alert(res.data.msg);
              return;
            }
          });
          axios.post("/travels/delFile",{
            flag:val.flag
          }).then((res)=>{
            console.log(res.data);
          });
        },
        upDataFn(val){
          this.$router.push("/my/updataTravels");
          this.setUpDataTravels(val);
        },
        ...mapMutations({
          setUpDataTravels:"SET_UPDATATRAVELS"
        })
      }
    }
</script>

<style scoped>
  .backIcon{
    height:1.6em;
    margin:5px 0px 0px 0px;
    position: relative;
    z-index: 10;
  }
  .myTravelsBox{
    color: #333;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #fff;
  }
  .noBox{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    color: skyblue;
    font-size: 1em;
    font-weight: bolder;
    text-align: center;
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
  .myTravelsScroll{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .myTravelsContent{
    padding: 5px 5px 35px 5px;
  }
  .travelsItem{
    padding: 10px 5px;
    border-radius: 4px;
    box-shadow: 0px 0px 2px rgba(128,128,128,0.3);
    font-size: 0.875em;
    margin-top: 15px;
  }
  .travelsItemTitle{
    border-bottom: 1px solid rgba(128,128,128,0.3);
  }
  .travelsItemTitle span{
    display: block;
    font-size: 1em;
    padding-bottom: 5px;
  }
  .travelsItemContent{
    padding: 5px;
    height: 100px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: pre-line;
    color: #666;
  }
  .operationBox{
    padding-top: 5px;
    border-top: 1px solid rgba(128,128,128,0.3);
    text-align: right;
  }
</style>
