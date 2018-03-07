<template>
  <div class="viewspotDetailBox">
    <div class="backBox">
      <img src="http://localhost:8080/static/icon/back.png"
           class="backIcon"
           @click="backFn"/>
      <p class="myTravelsTitle">{{viewspotDetail.articleName}}的游记</p>
    </div>
    <scroll :data="viewspotDetail.img" v-bind:style="{height:(h-32)+'px',overflow:'hidden'}">
      <div>
        <img :src="viewspotDetail.img.length>0?viewspotDetail.img[0].path:''" class="imgTitle"/>
        <p class="content">{{viewspotDetail.articleContent}}</p>
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from "@/base/scroll/scroll";
  import {mapGetters} from "vuex";
    export default {
        name: "viewspot_detail",
      data(){
          return{
            h:null
          }
      },
      created(){
        this.h=window.screen.height;
      },
      components:{
        Scroll
      },
      computed:{
        ...mapGetters(['viewspotDetail'])
      },
      methods:{
        backFn(){
          window.history.back();
        }
      }
    }
</script>

<style scoped>
  .viewspotDetailBox{
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    top: 0px;
    left: 0px;
    background: #fff;
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
  .imgTitle{
    width: 100%;
  }
  .content{
    padding: 5px;
    line-height: 1.6em;
    font-size: 0.875em;
  }
</style>
