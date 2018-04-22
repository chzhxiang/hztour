<template>
    <div>
      <scroll :data="bannerImg" v-bind:style="{height:(h-92)+'px',overflow:'hidden'}">
        <div>
          <slider-home :autoPlay="true" :loop="true" :data="bannerImg">
            <div v-for="item in bannerImg" class="sliderBox">
              <a href="#" @click="getList(item)">
                <img :src="item.img[0].path" class="needsclick"/>
              </a>
            </div>
          </slider-home>
          <div class="content">
            <div class="listItem" v-for="listItem in listData" @click="getList(listItem)">
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
  import Carousel from "vue-m-carousel";
  import Scroll from "@/base/scroll/scroll";
  import Slider from "@/base/slider/slider";
  import axios from "axios";
  import {mapGetters,mapMutations} from "vuex";
  import SliderHome from "@/base/slider/slider_home";
    export default {
        name: "travels",
      data(){
          return{
            bannerImg:[],
            listData:[],
            itemId:"itemImg",
            imgWidth:0,
            lis:[],
            num:0,
            timerAll:null,
            h:null,
            w:null
          }
      },
      created(){
        this.h=window.screen.height;
        this.w=window.screen.width;
        this.init();
        this.listInit();
      },
      components:{
        Carousel,
        Scroll,
        Slider,
		    SliderHome
      },
      computed:{
        ...mapGetters(['writeTravels','upDataTravels'])
      },
      methods:{
          //轮播图数据初始化
        init(){
		      axios.post("/travels/selAllTravels").then((res)=>{
            //console.log("游记list");
            //console.log(res.data);
            if(res.data.code===0){
              for(let i=res.data.data.length-1;i>=0;i--){
				        if(this.bannerImg.length>5){
					      return ;
				      }
                let flag=res.data.data[i].flag;
                let id=res.data.data[i]._id;
                let title=res.data.data[i].articleName;
                let timer=res.data.data[i].articleTime;
                let user=res.data.data[i].author;
                let userId=res.data.data[i].authorId;
                let content=res.data.data[i].articleContent;
                //console.log(i);
                axios.post("/travels/selTravelsimg",{
                  flag:res.data.data[i].flag
                }).then((resImg)=>{
                  //console.log("listData");
                  //console.log(resImg.data.data[0].path);
                  if(resImg.data.code===0){
                    if(resImg.data.data.length>0){
                      this.bannerImg.push({
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

                    }
                  }
                })
              }
            }
          })
        },
        //游记数据初始化
        listInit(){
          axios.post("/travels/selAllTravels").then((res)=>{
            //console.log("游记list");
            //console.log(res.data);
            if(res.data.code===0){
              for(let i=res.data.data.length-1;i>=0;i--){
                let flag=res.data.data[i].flag;
                let id=res.data.data[i]._id;
                let title=res.data.data[i].articleName;
                let timer=res.data.data[i].articleTime;
                let user=res.data.data[i].author;
                let userId=res.data.data[i].authorId;
                let content=res.data.data[i].articleContent;
                //console.log(i);
                axios.post("/travels/selTravelsimg",{
                  flag:res.data.data[i].flag
                }).then((resImg)=>{
                  //console.log("listData");
                  //console.log(resImg.data.data[0].path);
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
        },
        //游记点击事件
        getList(listItem){
          // console.log('000');
          this.setTravelsDateil(listItem);
          this.setTravelsDateilShow(true);
        },
        getListDetail(val){

        },
        ...mapMutations({
          setTravelsDateil:"SET_TRAVELSDATEIL",
          setTravelsDateilShow:"SET_TRAVELSDATEILSHOW"
        })
      },
      watch:{
        writeTravels(){
          this.bannerImg=[];
          this.listData=[];
          this.init();
          this.listInit();
        },
		upDataTravels(){
		  this.bannerImg=[];
          this.listData=[];
          this.init();
          this.listInit();
		}
      }
    }
</script>

<style scoped>
  .sliderBox{
    width: 100%;
    overflow: hidden;
    height: 250px;
    position: relative;
  }
  .sliderItem{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0px;
    bottom: 0px;
    z-index: 10;
  }
  .sliderItem a{
    width: 100%;
    display: block;
  }
  .sliderItem a img{
    width: 100%;
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
