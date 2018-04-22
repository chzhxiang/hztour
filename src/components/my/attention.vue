<template>
    <div class="attentionBox">
      <div class="backBox">
        <img src="http://localhost:8080/static/icon/back.png" class="backIcon" @click="backFn"/>
        <p class="myTravelsTitle">我的关注（{{userArr.length}}）</p>
      </div>
      <scroll class="scrollA">
        <div class="aCon">
          <div class="itemBox" v-for="(item,index) in userArr">
            <p class="itemImg" @click="userInfo(item)">
              <img :src="item.img?item.img:'http://localhost:8080/static/imgs/user/user.jpg'"/>
            </p>
            <div class="itemDateil">
              <p @click="userInfo(item)">{{item.userName}}</p>
              <button @click="delFnU(item,index)">删除</button>
            </div>
          </div>
        </div>
      </scroll>
      <div class="delMike" v-show="delIndex!==-1">
        <div class="delTxtBox">
          <p>确定删除？</p>
          <p>
            <button @click="delFn">确定</button>
            <button @click="delCan">取消</button>
          </p>
        </div>
      </div>
      <div class="delBox1">
        <input type="checkbox" ref="cBox"/>全选
        <button @click="delAll">删除</button>
      </div>
    </div>
</template>

<script>
  import Scroll from "@/base/scroll/scroll";
  import axios from "axios";
  import {mapMutations,mapGetters} from "vuex"
    export default {
        name: "attention",
      data(){
          return{
            userArr:[],
            delIndex:-1,
            delData:{}
          }
      },
      created(){
        if(window.localStorage.getItem("userInfo")){
          if(this.userArr.length>0){
            if(this.userArr[0].userId===JSON.parse(window.localStorage.getItem("userInfo"))[0].id){
              return;
            }else {
              this.userArr=[];
            }
          }
          this.init();
        }else {
          alert("您还未登录，请前往登录！");
          this.$router.push("/my/login");
        }
      },
      computed:{
        ...mapGetters(['loginSuccess','travelsDateilShow'])
      },
      components:{
        Scroll
      },
      methods:{
        backFn(){
          window.history.back();
        },
        delFnU(val,index){
          this.delIndex=index;
          this.delData=val;
        },
        delFn(){
          this.userDel(this.delData,this.delIndex);
          this.delCan();
        },
        delCan(){
          this.delIndex=-1;
          this.delData={};
        },
        delAll(){
          if(this.$refs.cBox.checked){
            if(this.userArr.length===0){
              return;
            }
            axios.post("/attention/delUserIdAttention",{
              userId:this.userArr[0].userId
            }).then((res)=>{
              if(res.data.code===0){
                alert("您的关注库已全部删除成功！");
                this.userArr=[];
                return;
              }else {
                alert("全部删除操作失败！");
                return;
              }
            })
          }else{
		    alert("请选择全选按钮");
		  }
        },
        init(){
          axios.post("/attention/selAttention",{
            userId:JSON.parse(window.localStorage.getItem("userInfo"))[0].id
          }).then((res)=>{
            // console.log(res.data);
            if(res.data.code===0){
              for(let i=res.data.data.length-1;i>=0;i--){
                axios.post("/user/selUser",{
                  _id:res.data.data[i].authorId
                }).then((resUser)=>{
                  // console.log(resUser.data);
                  let id=resUser.data.data[0]._id;
                  let userName=resUser.data.data[0].userName;
                  if(resUser.data.code===0){
                    axios.post("/user/reqAvatar",{
                      img:resUser.data.data[0].avatar
                    }).then((resImg)=>{
                      // console.log(resImg.data);
                      if(resImg.data.code===0){
                        if(resImg.data.data){
                          let obj={
                            userName:userName,
                            id:id,
                            img:resImg.data.data.path,
                            userId:JSON.parse(window.localStorage.getItem("userInfo"))[0].id
                          }
                          this.userArr.push(obj);
                        }else {
                          let obj={
                            userName:userName,
                            id:id,
                            img:'',
                            userId:JSON.parse(window.localStorage.getItem("userInfo"))[0].id
                          }
                          this.userArr.push(obj);
                        }
                      }
                      // console.log(this.userArr)
                    })
                  }
                })
              }
            }
          })
        },
        userDel(val,index){
          // console.log("userDel");
          // console.log(val);
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
        },
        userInfo(val){
          this.setAttentionData(val);
          this.$router.push("/travels/userTravelsList");
        },
        ...mapMutations({
          setAttentionData:"SET_ATTENTIONDATA"
        })
      },
      watch:{
        loginSuccess(){
          if(window.localStorage.getItem("userInfo")){
            if(this.userArr.length>0){
              if(this.userArr[0].userId===JSON.parse(window.localStorage.getItem("userInfo"))[0].id){
                return;
              }else {
                this.userArr=[];
              }
            }
            this.init();
          }
        },
        travelsDateilShow(){
          if(window.localStorage.getItem("userInfo")){
            this.userArr=[];
            this.init();
          }
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
    background: #f5f5f5;
    z-index: 100;
  }
  .scrollA{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .aCon{
    padding: 5px 0px 42px 0px;
  }
  .backBox{
    background: #fff;
  }
  .delMike{
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 10;
    background: rgba(128,128,128,0.2);
  }
  .delTxtBox{
    padding: 10px 20px;
    position: absolute;
    top: 50%;
    width: 100%;
    box-sizing: border-box;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }
  .delTxtBox p{
    text-align: center;
    background: #fff;
    margin: 0px;
  }
  .delTxtBox p:first-of-type{
    padding: 15px 0px;
    border-bottom: 1px solid skyblue;
  }
  .delTxtBox p:last-of-type{
    padding: 10px 20px;
    overflow: hidden;
    border: none;
  }
  .delTxtBox p:last-of-type button{
    display: block;
    width: 40%;
    background: transparent;
    padding: 5px 0px;
    outline: none;
  }
  .delTxtBox p:last-of-type button:last-of-type{
    float: right;
    border: 1px solid skyblue;
  }
  .delTxtBox p:last-of-type button:first-of-type{
    float: left;
    background: skyblue;
    border: 1px solid skyblue;
    color: #fff;
  }
  .delBox1{
    padding: 10px;
    box-sizing: border-box;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    background: #fff;
  }
  .delBox1 button{
    display: inline-block;
    float: right;
    background: skyblue;
    color: #fff;
    border: 1px solid skyblue;
    border-radius: 4px;
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
  .itemDateil button{
    display: block;
    float: right;
    /*height: 70px;*/
    line-height: 70px;
    outline: none;
    border: none;
    background: skyblue;
    padding: 0px 5px;
    color: #fff;
  }
</style>
