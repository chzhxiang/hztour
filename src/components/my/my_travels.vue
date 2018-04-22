<template>
    <div class="myTravelsBox">
      <div class="backBox">
        <img src="http://localhost:8080/static/icon/back.png" class="backIcon" @click="backFn"/>
        <p class="myTravelsTitle">我的游记（{{travelsData.length}}）</p>
      </div>
      <scroll class="myTravelsScroll">
        <div class="myTravelsContent">
          <div v-for="(item,index) in travelsData" class="travelsItem">
            <p class="travelsItemTitle" @click="goTranvels(item)">
              <span>{{item.articleName}}</span>
              <span>{{item.articleTime}}</span>
            </p>
            <p class="travelsItemContent">{{item.articleContent}}</p>
            <p style="padding: 5px;color: #666;">……</p>
            <p class="operationBox">
              <button @click="delTravelsU(item,index)">删除</button>
              <button @click="upDataFn(item)">编辑</button>
            </p>
          </div>
        </div>
      </scroll>
      <div class="delMike" v-show="delIndex!==-1">
        <div class="delTxtBox">
          <p>确定删除？</p>
          <p>
            <button @click="delFn">确定</button>
            <button @click="delCan">取消</button>
          </p>
        </div>
      </div>
      <div class="delBox1" v-show="travelsData.length!==0?true:false">
        <input type="checkbox" ref="cBox"/>全选
        <button @click="delAll">删除</button>
      </div>
      <p class="noBox" v-bind:style="{height:h+'px',lineHeight:h+'px'}" v-show="travelsData.length===0?true:false">您还没有游记哦~</p>
    </div>
</template>

<script>
  import Scroll from "@/base/scroll/scroll";
  import axios from "axios";
  import {mapMutations,mapGetters} from "vuex";
    export default {
        name: "my_travels",
      data(){
          return{
            userName:window.localStorage.getItem("userInfo")?JSON.parse(window.localStorage.getItem("userInfo"))[0].userName:'',
            travelsData:[],
            h:null,
            delData:{},
            delIndex:-1
          }
      },
      created(){
        this.h=window.screen.height;
        if(window.localStorage.getItem("userInfo")){
          if(this.travelsData.length>0){
            if(this.travelsData[0].authorId===JSON.parse(window.localStorage.getItem("userInfo"))[0].id){
              return;
            }else {
              this.travelsData=[];
            }
          }
          this.userName=JSON.parse(window.localStorage.getItem("userInfo"))[0].userName;
          axios.post("/travels/selTravels",{
            authorId:JSON.parse(window.localStorage.getItem("userInfo"))[0].id
          }).then((res)=>{
            // console.log("weweew");
            // console.log(res.data);
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
          alert("您还未登录，请前往登录！");
          this.$router.push("/my/login");
          return;
        }
      },
      mounted(){
        // console.log(9090);
      },
      computed:{
        ...mapGetters(['loginSuccess','writeTravels','upDataTravels'])
      },
      components:{
        Scroll
      },
      methods:{
        backFn(){
          // this.travelsData=[];
          // this.userName='';
          window.history.back();
          // this.$router.push("/my");
        },
        delAll(){
          if(this.$refs.cBox.checked){
            if(this.travelsData.length===0){
              return;
            }
            console.log(this.travelsData);
            axios.post("/travels/delAllTravels",{
              authorId:this.travelsData[0].authorId
            }).then((res)=>{
              if(res.data.code===0){
                for(let i=this.travelsData.length-1;i>=0;i--){
                  axios.post("/travels/delFile",{
                    flag:this.travelsData[i].flag
                  }).then((res)=>{
                    console.log(res.data);
                  });
                }
                this.travelsData=[];
                alert("您的游记库已清空！");
                return;
              }else {
                alert(res.data.msg);
                return;
              }
            });
          }
        },
        delFn(){
          this.delTravels(this.delData,this.delIndex);
          this.delCan();
        },
        delTravelsU(val,index){
          this.delData=val;
          this.delIndex=index;
        },
        delCan(){
          this.delData={};
          this.delIndex=-1;
        },
        //删除
        delTravels(val,index){
          // console.log(val);
          axios.post("/travels/delTravels",{
            _id:val._id
          }).then((res)=>{
            if(res.data.code===0){
              alert(res.data.msg);
              for(let i=this.travelsData.length-1;i>=0;i--){
                if(i===index){
                  this.travelsData.splice(i,1);
                }
              }
              axios.post("/travels/delFile",{
                flag:val.flag
              }).then((res)=>{
                console.log(res.data);
              });
              return;
            }else {
              alert(res.data.msg);
              return;
            }
          });
        },
        goTranvels(val){
          axios.post("/travels/selIdTravels",{
            _id:val._id
          }).then((res)=>{
            if(res.data.code===0){
              for(let i=res.data.data.length-1;i>=0;i--){
                let flag=res.data.data[i].flag;
                let id=res.data.data[i]._id;
                let title=res.data.data[i].articleName;
                let timer=res.data.data[i].articleTime;
                let user=res.data.data[i].author;
                let userId=res.data.data[i].authorId;
                let content=res.data.data[i].articleContent;
                axios.post("/travels/selTravelsimg",{
                  flag:res.data.data[i].flag
                }).then((resImg)=>{
                  //console.log("listData");
                  //console.log(resImg.data.data[0].path);
                  if(resImg.data.code===0){
                    if(resImg.data.data.length>0){
                      let obj={
                        flag:flag,
                        id:id,
                        title:title,
                        timer:timer,
                        author:user,
                        authorId:userId,
                        content:content,
                        img:resImg.data.data
                      };
                      this.setTravelsDateil(obj);
                      this.setTravelsDateilShow(true);
                    }else {
                      let obj={
                        flag:flag,
                        id:id,
                        title:title,
                        timer:timer,
                        author:user,
                        authorId:userId,
                        content:content,
                        img:[]
                      };
                      this.setTravelsDateil(obj);
                      this.setTravelsDateilShow(true);
                    }
                  }
                })
              }
            }
          })
        },
        upDataFn(val){
          this.$router.push("/my/updataTravels");
          this.setUpDataTravels(val);
        },
        ...mapMutations({
          setUpDataTravels:"SET_UPDATATRAVELS",
          setTravelsDateil:"SET_TRAVELSDATEIL",
          setTravelsDateilShow:"SET_TRAVELSDATEILSHOW"
        })
      },
      watch:{
        loginSuccess(){
          if(window.localStorage.getItem("userInfo")){
            if(this.travelsData.length>0){
              if(this.travelsData[0].authorId===JSON.parse(window.localStorage.getItem("userInfo"))[0].id){
                return;
              }else {
                this.travelsData=[];
              }
            }
            this.userName=JSON.parse(window.localStorage.getItem("userInfo"))[0].userName;
            axios.post("/travels/selTravels",{
              authorId:JSON.parse(window.localStorage.getItem("userInfo"))[0].id
            }).then((res)=>{
              if(res.data.code===0){
                if(res.data.data.length>0){
                  for(let i=res.data.data.length-1;i>=0;i--){
                    this.travelsData.push(res.data.data[i]);
                  }
                }else {

                }
              }
            })
          }
        },
        writeTravels(){
          if(window.localStorage.getItem("userInfo")){
            this.travelsData=[];
            this.userName=JSON.parse(window.localStorage.getItem("userInfo"))[0].userName;
            axios.post("/travels/selTravels",{
              authorId:JSON.parse(window.localStorage.getItem("userInfo"))[0].id
            }).then((res)=>{
              if(res.data.code===0){
                if(res.data.data.length>0){
                  for(let i=res.data.data.length-1;i>=0;i--){
                    this.travelsData.push(res.data.data[i]);
                  }
                }else {
                }
              }
            })
          }
        },
		upDataTravels(){
		  if(window.localStorage.getItem("userInfo")){
            this.travelsData=[];
            this.userName=JSON.parse(window.localStorage.getItem("userInfo"))[0].userName;
            axios.post("/travels/selTravels",{
              authorId:JSON.parse(window.localStorage.getItem("userInfo"))[0].id
            }).then((res)=>{
              if(res.data.code===0){
                if(res.data.data.length>0){
                  for(let i=res.data.data.length-1;i>=0;i--){
                    this.travelsData.push(res.data.data[i]);
                  }
                }else {
                }
              }
            })
          }
		}
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
  }
  .myTravelsScroll{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .myTravelsContent{
    padding: 5px 5px 64px 5px;
  }
  .travelsItem{
    padding: 10px 5px;
    border-radius: 4px;
    box-shadow: 0px 0px 2px rgba(128,128,128,0.3);
    font-size: 0.875em;
    margin-top: 15px;
    background: rgba(135,206,235,0.1);
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
    height: auto;
    max-height: 100px;
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
  .delMike{
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 10;
    background: rgba(128,128,128,0.2);
  }
  .delTxtBox{
    padding: 10px 20px;
    position: absolute;
    top: 50%;
    width: 100%;
    box-sizing: border-box;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }
  .delTxtBox p{
    text-align: center;
    background: #fff;
    margin: 0px;
  }
  .delTxtBox p:first-of-type{
    padding: 15px 0px;
    border-bottom: 1px solid skyblue;
  }
  .delTxtBox p:last-of-type{
    padding: 10px 20px;
    overflow: hidden;
    border: none;
  }
  .delTxtBox p:last-of-type button{
    display: block;
    width: 40%;
    background: transparent;
    padding: 5px 0px;
    outline: none;
  }
  .delTxtBox p:last-of-type button:last-of-type{
    float: right;
    border: 1px solid skyblue;
  }
  .delTxtBox p:last-of-type button:first-of-type{
    float: left;
    background: skyblue;
    border: 1px solid skyblue;
    color: #fff;
  }
  .delBox1{
    padding: 10px;
    box-sizing: border-box;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    background: #fff;
  }
  .delBox1 button{
    display: inline-block;
    float: right;
    background: skyblue;
    color: #fff;
    border: 1px solid skyblue;
    border-radius: 4px;
  }
</style>
