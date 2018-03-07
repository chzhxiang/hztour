<template>
    <div class="season">
      <div class="itemBox" >
        <p class="item" @click="getview(item)" v-for="item in seasonData">{{item.articleName}}</p>
      </div>
    </div>
</template>

<script>
  import {mapMutations} from "vuex"
  import axios from "axios";
    export default {
        name: "season",
      data(){
          return{
            seasonData:[],
            itemName:'item'
          }
      },
      created(){
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
              if(2<=new Date().getMonth()<5){
                if(season==='春'){

                }else {
                  continue;
                }
              }else if(5<=new Date().getMonth()<8){
                if(season==='夏'){

                }else {
                  continue;
                }
              }else if(8<=new Date().getMonth()<11){
                if(season==='秋'){

                }else {
                  continue;
                }
              }else {
                if(season==='冬'){

                }else {
                  continue;
                }
              }
              axios.post("/viewSpot/selTravelsimg",{
                flag:flag
              }).then((resImg)=>{
                console.log("resImg");
                console.log(i);
                console.log(resImg.data);
                if(resImg.data.code===0){
                  if(resImg.data.data.length>0){
                    this.seasonData.push({
                      id:id,
                      articleContent:articleContent,
                      articleName:articleName,
                      season:season,
                      img:resImg.data.data
                    })
                  }else {
                    this.seasonData.push({
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
      methods:{
        getview(val){
          this.$router.push("/viewspotDetail");
          this.setViewSpotDetail(val);
        },
        ...mapMutations({
          setViewSpotDetail:"SET_VIEWSPOTDETAIL"
        })
      }
    }
</script>

<style scoped>
  .season{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  .item{
    padding: 5px;
    border-radius: 10px;
    border: 1px solid skyblue;
    float: left;
    margin: 5px;
  }
</style>
