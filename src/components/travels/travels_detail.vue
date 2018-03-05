<template>
  <div class="list-detail-box" v-show="travelsDateilShow" ref="listDetailBox">
    <transition name="normal">
      <div>
        <div class="backBox">
          <img src="http://localhost:8080/static/icon/back.png" class="backIcon" @click="backFn"/>
          <p class="myTravelsTitle">游记</p>
        </div>
        <scroll>
          <div class="listdetail-content">
            <div class="listdetail-content-top">
              <h2 class="title" style="padding:0px;">{{travelsDateil.title}}</h2>
              <div style="padding:0px;overflow: hidden;">
                <p class="userItem">作者 ： {{travelsDateil.author}}</p>
                <p class="userItem" @click="collectionFn">
                  <img src="http://localhost:8080/static/icon/collection.png" style="transform: translateY(2px);display: inline;"/>
                  收藏
                </p>
                <p class="userItem" @click="followFn">
                  <img src="http://localhost:8080/static/icon/follow.png" style="transform: translateY(2px);display: inline;"/>
                  关注
                </p>
              </div>
            </div>
            <div id="travelsImg" v-html="str" v-bind:style="{overflow:'hidden',height: travelsDateil.img.length===0?'0px':'200px',background: '#fff',width:(travelsDateil.img.length*210)+'px'}"></div>
            <div class="article">
              <p>{{travelsDateil.content}}</p>
            </div>
          </div>
        </scroll>
      </div>
    </transition>
  </div>
</template>

<script>
  import axios from "axios";
  import Scroll from "@/base/scroll/scroll";
  import {mapMutations,mapGetters} from "vuex";
    export default {
        name: "travels_detail",
      data(){
          return{
            str:''
          }
      },
      components:{
        Scroll
      },
      created(){
        if(this.travelsDateilShow){
          // console.log(this.travelsDateilShow);
          this.str="";
          for(let i=0;i<this.travelsDateil.img.length;i++){
            // console.log(i);
            this.str+="<div style='width: 200px;height: 200px;float: left;overflow: hidden;margin: 5px;line-height: 200px;'><img src='"+this.travelsDateil.img[i].path+"' style='width: 200px;'/></div>";
          }
          // console.log("str");
          // console.log(this.str);
          document.getElementById('travelsImg').innerHTML=this.str;
        }
      },
      computed:{
        ...mapGetters(['travelsDateil','travelsDateilShow'])
      },
      methods:{
        backFn(){
          this.setTravelsDateilShow(false);
        },
        //收藏
        collectionFn(){
          if(!window.localStorage.getItem("userInfo")){
            alert("您还未登录，请前往登录！");
            this.$router.push('/my/login');
            return;
          }
          axios.post("/collection/addCollection",{
            articleId:this.travelsDateil.id,
            userId:JSON.parse(window.localStorage.getItem("userInfo"))[0].id,
            articleName:this.travelsDateil.title,
            articleImg:this.travelsDateil.img
          }).then((res)=>{
            console.log(res.data);
            if(res.data.code===0){
              alert("收藏成功，前往我的收藏即可查看！")
            }else {
              alert(res.data.msg);
            }
          })
          console.log("collectionFn");
        },
        //关注
        followFn(){
          if(JSON.parse(window.localStorage.getItem("userInfo")).length===0){
            alert("您还未登录，请前往登录！");
            this.$router.push('/my/login');
            return;
          }
          console.log("followFn");
          console.log(this.travelsDateil.author);
          axios.post("/attention/addAttention",{
            authorId:this.travelsDateil.author,
            userId:JSON.parse(window.localStorage.getItem("userInfo"))[0].id
          }).then((res)=>{
            console.log(res.data);
          })
        },
        ...mapMutations({
          setTravelsDateilShow:"SET_TRAVELSDATEILSHOW"
        })
      },
      watch:{
        travelsDateilShow(val){
          this.str="";
          for(let i=0;i<this.travelsDateil.img.length;i++){
            this.str+="<div style='width: 200px;height: 200px;float: left;overflow: hidden;margin: 5px;line-height: 200px;'><img src='"+this.travelsDateil.img[i].path+"' style='width: 200px;'/></div>";
          }
          document.getElementById('travelsImg').innerHTML=this.str;
        }
      }
    }
</script>

<style scoped lang="stylus">
  .userItem{
    margin 0px;
    padding 5px 5px 0px 0px !important;
    float left;
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
  }
  .list-detail-box
    position fixed
    top 0px
    left 0px
    height 100%
    z-index 110
    width 100%
    background #fff
  .listDetailTitle
    background rgb(236,244,255)
    text-align center
    width 100%
    overflow hidden
    margin 0px
    padding 10px
    .listDetailTitleImg
      position absolute
      left 10px
      top 10px
      width 20px
  .listdetail-content
    background rgb(245,245,245)
  .listdetail-content-top
    padding 5px
    background rgb(245,245,245)
    .listDetailImg
      width 60px
      height 60px
      border-radius 50%
    .title
      font-size 16px
      color #333
    p
      color #666
      padding 10px
      span
        padding 0px 5px
  .article
    height: 630px
    overflow: hidden
    box-sizing border-box
    padding 5px
    text-align left
    font-size 0.875em
    line-height 20px
    background #fff
    div
      p
        color #666
        font-size 14px
        line-height 28px
        text-align left
  .contentP
    padding-bottom 150px
    background #fff
    overflow hidden
    p
      line-height 28px
  .normal-enter-active, .normal-leave-active
    transition: all 0.4s
    .top, .bottom
      transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
  .normal-enter, .normal-leave-to
    opacity: 0
    .top
      transform: translate3d(0, -100px, 0)
    .bottom
      transform: translate3d(0, 100px, 0)
</style>
