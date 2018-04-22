<template>
  <div class="userListBox">
    <div class="backBox">
      <img src="http://localhost:8080/static/icon/back.png" class="backIcon" @click="backFn"/>
      <p class="myTravelsTitle">{{attentionData.userName}}的游记（{{listData.length}}）</p>
    </div>
    <scroll :data="listData" v-bind:style="{height:(h-92)+'px',overflow:'hidden'}">
      <div>
        <div class="content">
          <div class="listItem" v-for="listItem in listData" @click="getListDateil(listItem)">
            <div class="itemImg">
              <img :src="listItem.img.length>0?listItem.img[0].path:''"/>
            </div>
            <div class="itemTxt">
              <p v-bind:style="{width:(w-70)+'px'}">{{listItem.title}}</p>
              <p>
                <span>{{listItem.author}}</span>
                <span>{{listItem.timer}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
  import axios from "axios";
  import {mapGetters,mapMutations} from "vuex";
  import Scroll from "@/base/scroll/scroll";
    export default {
        name: "user_travels_list",
      data(){
          return{
            listData:[],
            h:null,
            w:null
          }
      },
      created(){
        this.getList();
        this.h=window.screen.height;
        this.w=window.screen.width;
        if(!this.attentionData.id){
          window.history.back();
        }
      },
      components:{
        Scroll
      },
      computed:{
        ...mapGetters(['attentionData'])
      },
      methods:{
        backFn(){
          window.history.back();
        },
        getList(){
          if(this.attentionData){
            // console.log(this.attentionData);
            axios.post("/travels/selTravels",{
              authorId:this.attentionData.id
            }).then((res)=>{
              // console.log(res.data);
              if(res.data.code===0){
                for(let i=res.data.data.length-1;i>=0;i--){
                  let flag=res.data.data[i].flag;
                  let id=res.data.data[i]._id;
                  let title=res.data.data[i].articleName;
                  let timer=res.data.data[i].articleTime;
                  let user=res.data.data[i].author;
                  let userId=res.data.data[i].authorId;
                  let content=res.data.data[i].articleContent;
                  // console.log(i);
                  axios.post("/travels/selTravelsimg",{
                    flag:res.data.data[i].flag
                  }).then((resImg)=>{
                    // console.log("listData");
                    // console.log(resImg.data.data);
                    if(resImg.data.code===0){
                      if(resImg.data.data.length>0){
                        this.listData.push({
                          flag:flag,
                          id:id,
                          title:title,
                          timer:timer,
                          author:user,
                          authorId:userId,
                          content:content,
                          img:resImg.data.data
                        })
                      }else {
                        this.listData.push({
                          flag:flag,
                          id:id,
                          title:title,
                          timer:timer,
                          author:user,
                          authorId:userId,
                          content:content,
                          img:[]
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        },
        //游记点击事件
        getListDateil(listItem){
          // console.log(listItem);
          this.setTravelsDateil(listItem);
          this.setTravelsDateilShow(true);
        },
        ...mapMutations({
          setTravelsDateil:"SET_TRAVELSDATEIL",
          setTravelsDateilShow:"SET_TRAVELSDATEILSHOW"
        })
      },
      watch:{
        attentionData(){
          this.getList();
        }
      }
    }
</script>

<style scoped>
  .userListBox{
    background: #fff;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 100;
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
  .listItem{
    overflow: hidden;
    padding: 5px;
    background: #f5f5f5;
  }
  .listItem div{
    float: left;
  }
  .listItem div.itemImg{
    width: 60px;
    height: 60px;
    overflow: hidden;
    background: #fff;
  }
  .listItem div.itemImg img{
    width: 100%;
  }
  .listItem div.itemTxt p{
    padding: 0px 5px;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: pre-line;
    background: #fff;
  }
</style>
