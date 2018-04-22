<template>
    <div class="collectionBox">
      <div class="backBox">
        <img src="http://localhost:8080/static/icon/back.png" class="backIcon" @click="backFn"/>
        <p class="myTravelsTitle">我的收藏（{{collectionData.length}}）</p>
      </div>
      <scroll v-bind:style="{height:(h-32)+'px'}" class="scrollCollenction" :data="collectionData">
        <div class="collectionContenBox">
          <div class="collectionItem" v-for="(item,index) in collectionData">
            <p class="delBox" @click="delGetData(item,index)">
              <img src="http://localhost:8080/static/icon/del.png" class="backIcon"/>
            </p>
            <img :src="item.img.length>0?item.img[0].path:null" class="itemImg"/>
            <div class="collectionDateil" @click="getItem(item)">
              <p>{{item.title}}</p>
              <p>作者：{{item.author}}</p>
            </div>
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
      <div class="delBox1">
        <input type="checkbox" ref="cBox"/>全选
        <button @click="delAll">删除</button>
      </div>
    </div>
</template>

<script>
  import Scroll from "@/base/scroll/scroll";
  import {mapMutations,mapGetters} from "vuex";
  import axios from "axios";
    export default {
        name: "collection",
      data(){
          return{
            collectionData:[],
            h:null,
            delData:{},
            delIndex:-1
          }
      },
      created(){
          // console.log(889);
        this.h=window.screen.height;
        if(window.localStorage.getItem("userInfo")){
          // console.log("34343");
          if(this.collectionData.length>0){
            if(this.collectionData[0].userId===JSON.parse(window.localStorage.getItem("userInfo"))[0].id){
              return;
            }else {
              this.collectionData=[];
            }
          }
          this.init();
        }else {
          alert("您还未登录，请前往登录！");
          return;
        }
      },
      computed:{
        ...mapGetters(['loginSuccess','travelsDateilShow'])
      },
      components:{
        Scroll
      },
      methods:{
        backFn(){
          window.history.back();
        },
        //初始化
        init(){
          axios.post("/collection/selCollection",{
            userId:JSON.parse(window.localStorage.getItem("userInfo"))[0].id
          }).then((res1)=>{
            // console.log(res1.data.data);
            if(res1.data.code===0){
              let userId=JSON.parse(window.localStorage.getItem("userInfo"))[0].id;
              for(let i=res1.data.data.length-1;i>=0;i--){
                let delId=res1.data.data[i]._id;
                axios.post("/travels/selIdTravels",{
                  _id:res1.data.data[i].articleId
                }).then((res2)=>{
                  // console.log("sdsk");
                  // console.log(res2.data);
                  if(res2.data.code===0){
                    if(res2.data.data.length>0){
                      // let articleName =res.data.data[0].articleName;
                      let flag=res2.data.data[0].flag;
                      let id=res2.data.data[0]._id;
                      let title=res2.data.data[0].articleName;
                      let timer=res2.data.data[0].articleTime;
                      let user=res2.data.data[0].author;
                      let content=res2.data.data[0].articleContent;
                      let authorId=res2.data.data[0].authorId;
                      axios.post("/travels/selTravelsimg",{
                        flag:flag
                      }).then((res3)=>{
                        // console.log("img");
                        // console.log(res3.data);
                        if(res3.data.code===0){
                          if(res3.data.data.length>0){
                            this.collectionData.push({
                              delId:delId,
                              flag:flag,
                              id:id,
                              title:title,
                              timer:timer,
                              author:user,
                              content:content,
                              img:res3.data.data,
                              authorId:authorId,
                              userId:userId
                            })
                          }else {
                            this.collectionData.push({
                              delId:delId,
                              flag:flag,
                              id:id,
                              title:title,
                              timer:timer,
                              author:user,
                              content:content,
                              img:[],
                              authorId:authorId,
                              userId:userId
                            })
                          }
                          // console.log(this.collectionData);
                        }
                      })
                      // this.collectionData.push(res.data.data);
                    }
                  }
                })
              }
            }
          });
        },
        delFn(){
          this.delItem(this.delData,this.delIndex);
          this.delData={};
          this.delIndex=-1;
        },
        delCan(){
          this.delData={};
          this.delIndex=-1;
        },
        delGetData(val,index){
          this.delData=val;
          this.delIndex=index;
        },
        //跳转
        getItem(val){
          // console.log(val)
          this.setTravelsDateil(val);
          this.setTravelsDateilShow(true);
        },
        delAll(){
          if(this.$refs.cBox.checked){
            if(this.collectionData.length===0){
              return;
            }
            axios.post("/collection/selUserIdCollection1",{
              userId:this.collectionData[0].userId
            }).then((res)=>{
              if(res.data.code===0){
                alert("您的收藏库已全部删除成功！");
                this.collectionData=[];
                return;
              }else {
                alert("全部删除操作失败！");
                return;
              }
            })
          }else{
		    alert("请选择全选按钮！");
		  };
        },
        //删除
        delItem(val,index){
                axios.post("/collection/delCollection",{
                  _id:val.delId
                }).then((res)=>{
                  // console.log(res.data);
                  if(res.data.code===0){
                    for(let i=this.collectionData.length-1;i>=0;i--){
                      if(i===index){
                        this.collectionData.splice(i,1);
                        break;
                      }
                    }
                  }
                  alert(res.data.msg);
                  return;
                })
        },
        ...mapMutations({
          setTravelsDateil:"SET_TRAVELSDATEIL",
          setTravelsDateilShow:"SET_TRAVELSDATEILSHOW"
        })
      },
      watch:{
        loginSuccess(){
          if(window.localStorage.getItem("userInfo")){
            if(this.collectionData.length>0){
              if(this.collectionData[0].userId===JSON.parse(window.localStorage.getItem("userInfo"))[0].id){
                return;
              }else {
                this.collectionData=[];
              }
            }
            this.init();
          }
        },
        travelsDateilShow(){
          if(window.localStorage.getItem("userInfo")){
            this.collectionData=[];
            this.init();
          }
        }
      }
    }
</script>

<style scoped>
  .collectionBox{
    background: #fff;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 10;
    overflow: hidden;
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
  }
  .scrollCollenction{
    overflow: hidden;
  }
  .collectionContenBox{
    padding: 0px 5px 42px 5px;
  }
  .collectionItem{
    position: relative;
    text-align: center;
    overflow: hidden;
    margin: 5px 0px;
    background-color: skyblue;
    width: 100%;
    height: 200px;
    box-sizing: border-box;
  }
  img.itemImg{
    width: 100%;
  }
  .delBox{
    border: none;
    outline: none;
    background: rgba(128,128,128,0.2);
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 5px;
    border-radius: 4px;
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
  .collectionDateil{
    position: absolute;
    left: 0px;
    bottom: 0px;
    padding: 5px;
    text-align: left;
    color: #fff;
    width: 100%;
    box-sizing: border-box;
    background: rgba(0,0,0,0.2);
  }
</style>
