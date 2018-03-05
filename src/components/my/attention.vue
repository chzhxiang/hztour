<template>
    <div class="attentionBox">
      <div class="backBox">
        <img src="http://localhost:8080/static/icon/back.png" class="backIcon" @click="backFn"/>
        <p class="myTravelsTitle">我的关注</p>
      </div>
    </div>
</template>

<script>
  import axios from "axios";
    export default {
        name: "attention",
      data(){
          return{

          }
      },
      created(){
        if(window.localStorage.getItem("userInfo")){
          console.log("selAttention");
          axios.post("/attention/selAttention",{
            userId:JSON.parse(window.localStorage.getItem("userInfo"))[0].id
          }).then((res)=>{
            console.log(res.data);
            if(res.data.code===0){
              axios.post("/user/selUsername",{
                userName:res.data.data[0].authorId
              }).then((resUser)=>{
                console.log(resUser.data);
                if(resUser.data.code===0){
                  axios.post("/user/reqAvatar",{
                    img:resUser.data.data[0].avatar
                  }).then((resImg)=>{
                    console.log(resImg.data);
                  })
                }
              })
            }
          })
        }
      },
      methods:{
        backFn(){
          window.history.back();
        }
      }
    }
</script>

<style scoped>
  .attentionBox{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #fff;
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
</style>
