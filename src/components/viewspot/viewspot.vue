<template>
    <div>
      <scroll :data="viewspotData" v-bind:style="{height:(h-92)+'px',overflow:'hidden'}">
        <div class="viewConten">
          <div v-for="item in viewspotData" class="viewItem" v-bind:style="{paddingBottom:5*viewspotData.length+'px'}">
            <img :src="item.img.length>0?item.img[0].path:''"/>
            <p class="title">{{item.articleName}}</p>
            <p class="dateil">{{item.articleContent}}</p>
            <p class="season">{{item.season?'推荐游玩时节：'+item.season:''}}</p>
          </div>
        </div>
      </scroll>
    </div>
</template>

<script>
  import axios from "axios";
  import Scroll from "@/base/scroll/scroll";
    export default {
        name: "viewspot",
      data(){
        return{
          viewspotData:[],
          h:null
        }
      },
      created(){
        this.h=window.screen.height;
        axios.post("/viewSpot/selAllTravels").then((res)=>{
          console.log(res.data);
          if(res.data.code===0){
            for(let i=res.data.data.length-1;i>=0;i--){
              let flag=res.data.data[i].flag;
              console.log(res.data.data);
              let id=res.data.data[i]._id;
              let articleContent=res.data.data[i].articleContent;
              let articleName=res.data.data[i].articleName;
              let season=res.data.data[i].season;
              axios.post("/viewSpot/selTravelsimg",{
                flag:flag
              }).then((resImg)=>{
                console.log("resImg");
                console.log(i);
                console.log(resImg.data);
                if(resImg.data.code===0){
                  if(resImg.data.data.length>0){
                    this.viewspotData.push({
                      id:id,
                      articleContent:articleContent,
                      articleName:articleName,
                      season:season,
                      img:resImg.data.data
                    })
                  }else {
                    this.viewspotData.push({
                      id:id,
                      articleContent:articleContent,
                      articleName:articleName,
                      season:season,
                      img:[]
                    })
                  }
                }
              })
            }
          }
        })
      },
      components:{
        Scroll
      },
      methods:{

      }
    }
</script>

<style scoped>
  .viewConten{
    padding: 0px 5px;
  }
  .viewItem{
    box-shadow: 0px 0px 2px rgba(128,128,128,0.2);
    margin: 10px;
  }
  .viewItem img{
    width: 100%;
  }
  .viewItem .title{
    font-size: 1em;
    padding: 5px 5px 0px 5px;
    color: #333;
  }
  .viewItem .dateil{
    height: auto;
    max-height: 5em;
    padding: 5px 5px 0px 5px;
    color: #666;
    font-size: 0.875em;
    overflow: hidden;
    line-height: 1.6em;
  }
  .viewItem .season{
    padding: 5px;
    color: skyblue;
  }
</style>
