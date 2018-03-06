<template>
    <div class="attentionBox">
      <div class="backBox">
        <img src="http://localhost:8080/static/icon/back.png" class="backIcon" @click="backFn"/>
        <p class="myTravelsTitle">我的关注</p>
      </div>
      <scroll>
        <div>
          <div class="itemBox" v-for="(item,index) in userArr">
            <p class="itemImg">
              <img :src="item.img"/>
            </p>
            <div class="itemDateil">
              <p>{{item.userName}}</p>
              <p @click="userDel(item,index)">删除</p>
            </div>
          </div>
        </div>
      </scroll>
    </div>
</template>

<script>
  import Scroll from "@/base/scroll/scroll";
  import axios from "axios";
    export default {
        name: "attention",
      data(){
          return{
            userArr:[]
          }
      },
      created(){
        if(window.localStorage.getItem("userInfo")){
          // console.log("selAttention");
          axios.post("/attention/selAttention",{
            userId:JSON.parse(window.localStorage.getItem("userInfo"))[0].id
          }).then((res)=>{
            console.log(res.data);
            if(res.data.code===0){
              for(let i=res.data.data.length-1;i>=0;i--){
                axios.post("/user/selUser",{
                  _id:res.data.data[i].authorId
                }).then((resUser)=>{
                  console.log(resUser.data);
                  let id=resUser.data.data[i]._id;
                  let userName=resUser.data.data[i].userName;
                  if(resUser.data.code===0){
                    axios.post("/user/reqAvatar",{
                      img:resUser.data.data[0].avatar
                    }).then((resImg)=>{
                      console.log(resImg.data);
                      if(resImg.data.code===0){
                        if(resImg.data.msg.path){
                          let obj={
                            userName:userName,
                            id:id,
                            img:resImg.data.msg.path
                          }
                          this.userArr.push(obj);
                        }else {
                          let obj={
                            userName:userName,
                            id:id,
                            img:''
                          }
                          this.userArr.push(obj);
                        }
                      }
                      console.log(this.userArr)
                    })
                  }
                })
              }
            }
          })
        }else {
          alert("您还未登录，请前往登录！");
          this.$router.push("/my/login");
        }
      },
      components:{
        Scroll
      },
      methods:{
        backFn(){
          window.history.back();
        },
        userDel(val,index){
          console.log("userDel");
          console.log(val);
          axios.post("/attention/delAttention",{
            userId:JSON.parse(window.localStorage.getItem("userInfo"))[0].id,
            authorId:val.id
          }).then((res)=>{
            // console.log(res.data);
            alert(res.data.msg);
            if(res.data.code===0){
              for(let i=this.userArr.length-1;i>=0;i--){
                if(i===index){
                  this.userArr.splice(i,1);
                  break;
                }
              }
            }
          });
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
    background: #e5e5e5;
    z-index: 100;
  }
  .backBox{
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
    /*z-index: -1;*/
  }
  .itemBox{
    overflow: hidden;
    display: flex;
    background: #fff;
    margin: 10px 0px;
    height: 70px;
  }
  .itemImg{
    overflow: hidden;
    float: left;
    padding:5px;
  }
  .itemImg img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  .itemDateil{
    float: left;
    height: 70px;
    flex: 1;
    position: relative;
  }
  .itemDateil p{
    height: 70px;
    line-height: 70px;
  }
  .itemDateil p:first-of-type{
    float: left;
    padding: 5px;
  }
  .itemDateil p:last-of-type{
    float: right;
    background: skyblue;
    padding: 5px;
    color: #fff;
  }
</style>
