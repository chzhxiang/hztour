<template>
    <div class="serverBox">
      <div class="backBox">
        <img src="http://localhost:8080/static/icon/back.png" class="backIcon" @click="backFn"/>
        <p class="myTravelsTitle">
          联系客服
          <span @click="delInfo">清空记录</span>
        </p>
      </div>
      <Scroll class="serverScroll" v-bind:style="{width:(w-10)+'px'}">
        <div class="contentServer"></div>
      </Scroll>
      <div class="inpBox">
        <input type="text" placeholder="说点什么吧……" v-bind:style="{width:(w-75)+'px'}" v-model="txt" @keyup.enter="sendMsg"/><button @click="sendMsg">发送</button>
      </div>
    </div>
</template>

<script>
  import Scroll from "@/base/scroll/scroll";
  import {mapGetters} from "vuex";
  import Io from "socket.io-client";
  const socket=Io('ws://localhost:9090');
    export default {
      name: "server_chat",
      data(){
        return{
          w:0,
          chatId:'',
          txt:''
        }
      },
      components:{
        Scroll
      },
      activated(){
        if(!window.localStorage.getItem("userInfo")){
          alert("您还未登录请前往登录！");
          return;
        }else if(window.localStorage.getItem("userInfo")){
          this.chatId=JSON.parse(window.localStorage.getItem("userInfo"))[0].id;
        }
      },
      created(){
        this.w=window.screen.width;
        socket.on("recvmsg",(data)=>{
          console.log(data);
        })
      },
      computed:{
        ...mapGetters(["chat"])
      },
      methods:{
        backFn(){
          window.history.back();
        },
        sendMsg(){
          if(!window.localStorage.getItem("userInfo")){
            alert("您还未登录请前往登录！");
            return;
          }
          socket.emit('sendmsg',{
            from:JSON.parse(window.localStorage.getItem("userInfo"))[0].id,
            to:"admins",
            txt:this.txt,
            userName:JSON.parse(window.localStorage.getItem("userInfo"))[0].userName,
            userAva:JSON.parse(window.localStorage.getItem("userInfo"))[0].avatar
          });
          this.txt='';
        },
        delInfo(){
          console.log("dsds");
        }
      }
    }
</script>

<style scoped>
  .serverBox{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    top: 0px;
    left: 0px;
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
  }
  .myTravelsTitle span{
    display:block;
    padding:0px 5px;
    float: right;
  }
  .serverScroll{
    position: absolute;
    top: 32px;
    bottom: 40px;
    left: 0px;
    width: 100%;
    background: rgba(135,206,235,0.2);
    overflow: hidden;
    padding: 5px;
    border: 1px solid #999;
    margin: 0px 5px;
  }
  .inpBox{
    position: absolute;
    bottom: 0px;
    height: 40px;
    width: 100%;
    left: 0px;
    padding: 5px;
  }
  .inpBox input{
    height: 30px;
    padding: 0px 5px;
    border: 1px solid #999;
    border-radius: 4px;
  }
  .inpBox button{
    width: 60px;
    background: skyblue;
    border: none;
    border-radius: 4px;
    height: 30px;
    color: #fff;
    float: right;
  }
</style>
