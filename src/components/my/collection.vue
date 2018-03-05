<template>
    <div class="collectionBox">
      <div class="backBox">
        <img src="http://localhost:8080/static/icon/back.png" class="backIcon" @click="backFn"/>
        <p class="myTravelsTitle">我的收藏</p>
      </div>
      <scroll>
        <div class="collectionContenBox">
          <div class="collectionItem"
               v-for="(item,index) in collectionData">
            <p class="delBox" @click="delItem(item,index)">
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
    </div>
</template>

<script>
  import Scroll from "@/base/scroll/scroll";
  import {mapMutations} from "vuex";
  import axios from "axios";
    export default {
        name: "collection",
      data(){
          return{
            collectionData:[]
          }
      },
      created(){
        if(window.localStorage.getItem("userInfo")){
          console.log("34343");
          axios.post("/collection/selCollection",{
            userId:JSON.parse(window.localStorage.getItem("userInfo"))[0].id
          }).then((res1)=>{
            console.log(res1.data.data);
            if(res1.data.code===0){
              for(let i=res1.data.data.length-1;i>=0;i--){
                let delId=res1.data.data[i]._id;
                axios.post("/travels/selIdTravels",{
                  _id:res1.data.data[i].articleId
                }).then((res2)=>{
                  console.log("sdsk");
                  console.log(res2.data);
                  if(res2.data.code===0){
                    if(res2.data.data.length>0){
                      // let articleName =res.data.data[0].articleName;
                      let flag=res2.data.data[0].flag;
                      let id=res2.data.data[0]._id;
                      let title=res2.data.data[0].articleName;
                      let timer=res2.data.data[0].articleTime;
                      let user=res2.data.data[0].author;
                      let content=res2.data.data[0].articleContent;
                      axios.post("/travels/selTravelsimg",{
                        flag:flag
                      }).then((res3)=>{
                        console.log("img");
                        console.log(res3.data);
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
                                img:res3.data.data
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
                                img:[]
                              })
                            }
                            console.log(this.collectionData);
                        }
                      })
                      // this.collectionData.push(res.data.data);
                    }
                  }
                })
              }
            }
          });
        }else {
          alert("您还未登录，请前往登录！");
          return;
        }
      },
      components:{
        Scroll
      },
      methods:{
        backFn(){
          window.history.back();
        },
        //跳转
        getItem(val){
          console.log(val);
          this.setTravelsDateil(val);
          this.setTravelsDateilShow(true);
        },
        //删除
        delItem(val,index){
          console.log(val);
          axios.post("/collection/delCollection",{
            _id:val.delId
          }).then((res)=>{
            console.log(res.data);
            if(res.data.code===0){
              for(let i=this.collectionData.length-1;i>=0;i--){
                if(i===index){
                  this.collectionData.splice(i,1);
                  break;
                }
              }
            }
            alert(res.data.msg);
          })
        },
        ...mapMutations({
          setTravelsDateil:"SET_TRAVELSDATEIL",
          setTravelsDateilShow:"SET_TRAVELSDATEILSHOW"
        })
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
    /*z-index: -1;*/
  }
  .collectionContenBox{
    padding: 0px 5px;
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
    position: absolute;
    top: 0px;
    right: 0px;
    padding: 5px;
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
