<template>
  <div class="list-detail-box" v-show="travelsDateilShow" ref="listDetailBox">
    <transition name="normal">
      <div>
        <div class="backBox">
          <img src="http://localhost:8080/static/icon/back.png" class="backIcon" @click="backFn"/>
          <p class="myTravelsTitle">
            游记
            <span @click="goLogin">登录</span>
          </p>
        </div>
        <scroll class="scrollDateil" v-bind:style="{height:h+'px'}" :data="commentList">
          <div class="listdetail-content">
            <div class="listdetail-content-top">
              <h2 class="title" style="padding:0px;">{{travelsDateil.title}}</h2>
              <div style="padding:0px;overflow: hidden;">
                <p class="userItem">作者 ： {{travelsDateil.author}}</p>
                <button class="userItem" @click="collectionFn">
                  <img src="http://localhost:8080/static/icon/collection.png" style="transform: translateY(2px);display: inline;"/>
                  收藏({{c}})
                </button>
                <button class="userItem" @click="followFn">
                  <img src="http://localhost:8080/static/icon/follow.png" style="height:18px;transform: translateY(4px);display: inline;"/>
                  关注({{a}})
                </button>
                <button class="userItem" @click="encourageFn">
                  <img src="http://localhost:8080/static/icon/encourage.png" style="height:18px;transform: translateY(4px);display: inline;"/>
                  赞({{e}})
                </button>
              </div>
            </div>
			<scroll-x :data="travelsDateil.img" style="width: 100%;overflow: hidden;">
			  <div id="travelsImg"
                 v-html="str"
                 v-bind:style="{overflow:'hidden',height: !travelsDateil.img?'0px':'150px',background: '#fff',width:travelsDateil.img?((travelsDateil.img.length*210)<w?'100%':(travelsDateil.img.length*210)+'px'):'0px'}">
			  </div>
			</scroll-x>
            <div class="article">
              <p>{{travelsDateil.content}}</p>
            </div>
            <div class="commentBox">
              <p>评论：</p>
              <textarea class="commentTxt" v-model="commentTxt"></textarea>
              <p class="btnBox">
                <button class="btn" @click="addComment">发表</button>
              </p>
              <ul class="commentItem">
                <li v-for="item in commentList">
                  <div>
                    <div class="imgBox">
                      <img :src="item.img"/>
                    </div>
                    <div class="txtBox">
                      <p>{{item.userName}}</p>
                      <p class="timerBox">{{item.timer}}</p>
                      <p>{{item.txt}}</p>
                      <div class="btn">
                        <button @click="reply(item)">评论</button>
                        <button v-show="userId===travelsDateil.authorId||userId===item.userId"
                                @click="delComment(item.id)">删除</button>
                      </div>
                      <div class="replyBox" v-show="item.replyArr.length>0">
                        <div class="replyItem" v-for="i in replyN"  v-show="i.id===item.id">
                          <p>{{i.name}}:</p>
                          <p>{{i.txt}}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </scroll>
        <div class="mike" v-show="replyData.id">
          <div class="mikeCon" v-bind:style="{width:w-40+'px'}">
            <p class="mikeInp">
              <input type="text" placeholder="请输入" v-model="replyTxt" @keyup.enter="mikeOkFn"/>
            </p>
            <div class="mikeBtn">
              <div class="mikeOk">
                <button @click="mikeOkFn">确认</button>
              </div>
              <div class="mikeCan">
                <button @click="mikeCanFn">取消</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import axios from "axios";
  import Scroll from "@/base/scroll/scroll";
  import {mapMutations,mapGetters} from "vuex";
  import ScrollX from "@/base/scroll/scroll_x"
  import {data} from "@/common/js/data.js";
    export default {
        name: "travels_detail",
      data(){
          return{
            str:'',
			      w:null,
            h:null,
			      c:0,
			      a:0,
            e:0,
            commentTxt:'',
            commentList:[],
            userId:'',
            replyData:{},
            replyTxt:'',
            replyN:[],
            sum:0
          }
      },
      components:{
        Scroll,
		    ScrollX
      },
      created(){
		    this.h=window.screen.height;
		    this.w=window.screen.width;
        if(window.localStorage.getItem("userInfo")){
          this.userId=JSON.parse(window.localStorage.getItem("userInfo"))[0].id;
        }
        if(this.travelsDateilShow){
          // console.log(this.travelsDateil.authorId);
          if(this.commentList.length>0){

          }else {
            this.commentData();
          }
          this.init();
          // console.log(this.travelsDateilShow);
          this.str="";
          for(let i=0;i<this.travelsDateil.img.length;i++){
            this.str+="<div style='width: 200px;height: 200px;float: left;overflow: hidden;margin: 5px;line-height: 200px;'><img src='"+this.travelsDateil.img[i].path+"' style='width: 200px;'/></div>";
          }
          document.getElementById('travelsImg').innerHTML=this.str;
        }
      },
	  mounted(){

	  },
      computed:{
        ...mapGetters(['travelsDateil','travelsDateilShow'])
      },
      methods:{
        backFn(){
          this.commentTxt='';
          this.commentList=[];
          this.replyN=[];
          this.setTravelsDateilShow(false);
        },
		    init(){
          axios.post("/encourage/selEncourage",{
            articleId:this.travelsDateil.id
          }).then((res)=>{
            // console.log(res.data);
            if(res.data.code===0){
              this.e=res.data.data.length;
            }
          });
		      axios.post("/collection/selCollectionId",{
            articleId:this.travelsDateil.id
          }).then((res)=>{
            if(res.data.code===0){
              //console.log(res.data);
			        this.c=res.data.data.length;
            }else {

            }
          });
		      axios.post("/attention/selAttentionid",{
            authorId:this.travelsDateil.authorId
          }).then((res)=>{
            if(res.data.code===0){
			        this.a=res.data.data.length;
            }else {

            }
          });
		    },
        //评论
        commentData(){
          axios.post('/comment/selComment',{
            articleId:this.travelsDateil.id
          }).then((res)=>{
            // console.log(res.data);
            if(res.data.code===0){
              // this.commentList='';
              for(let i=res.data.data.length-1;i>=0;i--){
                let txt=res.data.data[i].commentTxt;
                let id=res.data.data[i]._id;
                let timer=res.data.data[i].timer?res.data.data[i].timer:'';
                let userId=res.data.data[i].userId;
                axios.post("/user/selUser",{
                  _id:res.data.data[i].userId
                }).then((userRes)=>{
                  // console.log(userRes.data);
                  let userName=userRes.data.data[0].userName;
                  if(userRes.data.code===0){
                    axios.post("/reply/selReply",{
                      commentId:id
                    }).then((resR)=>{
                      // console.log(resR.data);
                      if(resR.data.code===0){
                        let rArr=resR.data.data;
                        for(let k=0;k<resR.data.data.length;k++){
                          // console.log(k);
                          axios.post("/user/selUser",{
                            _id:resR.data.data[k].userId
                          }).then((resN)=>{
                            // console.log(resN.data);
                            if(resN.data.code===0){
                              let obj={
                                txt:resR.data.data[k].replyTxt,
                                name:resN.data.data[0].userName,
                                id:id
                              };
                              this.replyN.push(obj);
                              // console.log(this.replyN)
                            }
                          })
                        }
                        if(userRes.data.data[0].avatar){
                          axios.post("/user/reqAvatar",{
                            img:userRes.data.data[0].avatar
                          }).then((resImg)=>{
                            // console.log(resImg.data);
                            if(resImg.data.code===0){
                              let img=resImg.data.data.path;
                              let obj={
                                userName:userName,
                                img:img,
                                txt:txt,
                                id:id,
                                timer:timer,
                                userId:userId,
                                replyArr:rArr
                              }
                              this.commentList.push(obj);
                            }
                          })
                        }else {
                          let obj={
                            userName:userName,
                            img:'',
                            txt:txt,
                            id:id,
                            timer:timer,
                            userId:userId,
                            replyArr:rArr
                          }
                          this.commentList.push(obj);
                        }
                        // console.log(this.commentList);
                      }
                    })
                  }
                })
              }
            }
          })
        },
        //收藏
        collectionFn(){
          // console.log(90);
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
            // console.log(res.data);
            if(res.data.code===0){
              alert("收藏成功，前往我的收藏即可查看！")
              this.c++;
            }else {
              alert(res.data.msg);
            }
          })
          //console.log("collectionFn");
        },
        //关注
        followFn(){
          if(JSON.parse(window.localStorage.getItem("userInfo")).length===0){
            alert("您还未登录，请前往登录！");
            this.$router.push('/my/login');
            return;
          }
          //console.log("followFn");
          //console.log(this.travelsDateil.author);
          axios.post("/attention/addAttention",{
            authorId:this.travelsDateil.authorId,
            userId:JSON.parse(window.localStorage.getItem("userInfo"))[0].id
          }).then((res)=>{
            // console.log(res.data);
            if(res.data.code===0){
              alert("关注成功，可前往我的关注查看！");
              this.a++;
            }else {
              alert(res.data.msg);
            }
          })
        },
        //点赞
        encourageFn(){
          // console.log(1);
          if(this.sum>0){
            return;
          }
          this.sum++;
          if(!window.localStorage.getItem("userInfo")){
            alert("您还未登录，请前往登录！");
            return;
          }
          // console.log(90);
          axios.post("/encourage/selYEncourage",{
            articleId:this.travelsDateil.id,
            userId:JSON.parse(window.localStorage.getItem("userInfo"))[0].id
          }).then((res)=>{
            // console.log(res.data);
            if(res.data.code===0){
              if(res.data.data.length>0){
                alert("您已为该文章点赞！");
                this.sum=0;
                return;
              }else {
                axios.post("/encourage/addEncourage",{
                  articleId:this.travelsDateil.id,
                  userId:JSON.parse(window.localStorage.getItem("userInfo"))[0].id
                }).then((resA)=>{
                  // console.log(res.data);
                  if(resA.data.code===0){
                    this.e++;
                    alert("点赞成功！");
                    this.sum=0;
                    return;
                  }else {
                    alert("点赞失败，请重试！");
                    this.sum=0;
                    return;
                  }
                })
              }
            }
          })
        },
        //发表评论
        addComment(){
          if(!window.localStorage.getItem('userInfo')){
            alert('您还未登录账户，不能参与评论！');
            return;
          }
          if(!this.commentTxt.trim()){
            alert("请输入评论内容");
            return;
          }
          for(let i=0;i<data.length;i++){
			let str=data[i].replace(/\//g,"");
            if(this.commentTxt.trim().indexOf(str)!==-1){
              alert("您的评论内容涉及敏感词汇，请重新编辑！");
              return;
            }
          }
          let userId=JSON.parse(window.localStorage.getItem('userInfo'))[0].id;
          let t=new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()+' '+new Date().getHours()+':'+new Date().getSeconds()+':'+new Date().getMinutes();
          axios.post("/comment/addComment",{
            userId:userId,
            articleId:this.travelsDateil.id,
            commentTxt:this.commentTxt,
            timer:t
          }).then((res)=>{
            // console.log(res.data);
            if(res.data.code===0){
              let obj={
                userName:JSON.parse(window.localStorage.getItem('userInfo'))[0].userName,
                img:JSON.parse(window.localStorage.getItem('userInfo'))[0].avatar,
                txt:this.commentTxt,
                id:res.data.data._id,
                timer:t,
                userId:userId,
                replyArr:[]
              }
              this.commentList.unshift(obj);
              // console.log(this.commentList);
              this.commentTxt='';
              alert('发表成功!');
            }else {
              this.commentTxt='';
              alert(res.data.msg);
            }
          })
        },
        //删除评论
        delComment(val){
          axios.post("/comment/removeComment",{
            _id:val
          }).then((res)=>{
            // console.log(res.data);
            if(res.data.code===0){
              alert("删除成功！");
              for(let i=this.commentList.length-1;i>=0;i--){
                if(val===this.commentList[i].id){
                  this.commentList.splice(i,1);
                  break;
                }
			        }
            }else {
              alert("删除失败，请重试！");
            }
          });
          axios.post("/reply/delReply",{
            commentId:val
          }).then((res)=>{
            // console.log(res.data);
          })
        },
        //登录
        goLogin(){
          this.backFn();
          this.$router.push("/my/login");
        },
        //回复
        reply(val){
          this.replyData=val;
        },
        //
        mikeOkFn(){
          if(!window.localStorage.getItem('userInfo')){
            alert('您还未登录账户，不能参与评论！');
            return;
          }
          if(!this.replyTxt.trim()){
            alert("请输入内容！");
            return;
          }
          axios.post("/reply/addReply",{
            commentId:this.replyData.id,
            userId:JSON.parse(window.localStorage.getItem('userInfo'))[0].id,
            replyTxt:this.replyTxt
          }).then((res)=>{
            // console.log(res.data);
            if(res.data.code===0){
              this.replyN=[];
              // console.log(this.replyN);
              alert("操作成功！");
              this.replyData={};
              this.commentList=[];
              this.replyTxt='';
              this.commentData();
              return;
            }else {
              alert("操作失败，请重试！");
              return;
            }
          })
        },
        //取消回复
        mikeCanFn(){
          this.replyData={};
        },
        ...mapMutations({
          setTravelsDateilShow:"SET_TRAVELSDATEILSHOW"
        })
      },
      watch:{
        travelsDateilShow(val){
			    if(val){
            if(this.commentList.length>0){

            }else {
              this.commentData();
            }
			      this.init();
				    this.str="";
				    for(let i=0;i<this.travelsDateil.img.length;i++){
					    this.str+="<div style='width: 200px;height: 200px;float: left;overflow: hidden;margin: 5px;line-height: 200px;'><img src='"+this.travelsDateil.img[i].path+"' style='width: 200px;'/></div>";
				    }
				    document.getElementById('travelsImg').innerHTML=this.str;
			    }else {
            this.commentTxt='';
            this.commentList=[];
          }
		    }
      }
    }
</script>

<style scoped lang="stylus">
  .userItem{
    margin 0px;
    padding 5px 5px 0px 0px !important;
    float left;
    display block;
    border none;
    outline:none;
    background transparent;
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
  .myTravelsTitle span{
    display:block;
    padding:0px 5px;
    float: right;
  }
  .scrollDateil{
	  width:100%;
	  height:100%;
	  overflow:hidden;
  }
  .commentBox{
	  margin:0px;
	  padding:0px 5px 34px 5px;
  }
  .commentBox p{
	  margin:0px;
	  padding:0px;
  }
  .btnBox{
    text-align:right ;
  }
  .commentTxt{
    outline:none;
    width: 100%;
    height: 150px;
    resize: none;
    margin: 5px 0px;
    border: 1px solid #ccc;
    padding:5px;
    box-sizing:border-box;
  }
  .commentItem{
    box-sizing:border-box;
  }
  .commentItem li{
    margin 5px 0px;
    padding 5px;
    background #fff;
    box-sizing:border-box;
  }
  .commentItem li div:first-of-type{
    display:flex ;
  }
  .commentItem li .txtBox .btn{
    text-align:right !important;
  }
  .commentItem li .txtBox .btn button{
	  color:red;
	  border:none;
	  outline:none;
	  background:#fff;
  }
  .commentItem li .txtBox .btn button:first-of-type{
	  color:skyblue;
  }
  .commentItem li div.imgBox{
    width 60px;
    height 60px;
    overflow hidden;
    text-align content ;
    line-height 60px;
    position relative;
    border-radius 50%;
    background #fff;
    border:1px solid #999;
  }
  .commentItem li div.imgBox img{
    display block;
    width 100%;
    position absolute;
    left 50%;
    top:50%;
    transform:translateY(-50%) translateX(-50%);
  }
  .commentItem li div.txtBox{
    flex 1;
    padding 0px 0px 0px 5px;
  }
  .commentItem li div.txtBox p{
    margin 5px 0px;
  }
  .mike{
    position:fixed;
    top:0px;
    left:0px;
    width:100%;
    height:100%;
    background:rgba(128,128,128,0.2);
    z-index:10;
  }
  .mikeCon{
    background #fff;
    position absolute;
    top:50%;
    left:50%;
    padding 20px 0px;
    transform translateY(-50%) translateX(-50%);
  }
  .mikeInp{
    padding 5px 10px;
  }
  .mikeInp input{
    font-size 0.875em !important;
    height 30px;
    padding 0px 5px;
    border-bottom 1px solid skyblue;
    width 100%;
  }
  .mikeBtn{
    overflow hidden;
  }
  .mikeBtn .mikeOk,.mikeBtn .mikeCan{
    float left ;
    width 50%;
    margin 5px 0px;
    padding 0px 15px;
    text-align center;
   }
  .mikeBtn .mikeOk button{
    /*display block !important;*/
    border none;
    text-align center;
    line-height 30px;
    background skyblue;
    color #fff;
    outline none;
    padding 0px 30px;
  }
  .mikeBtn .mikeCan button{
    /*display block !important;*/
    border none;
    outline none;
    background transparent;
    text-align center;
    line-height 30px;
    border 1px solid skyblue;
    color skyblue;
    padding 0px 30px;
  }
  .timerBox{
    border-bottom 1px solid #999;
    padding-bottom 5px !important;
  }
  .replyBox{
    position: relative;
    margin 10px 5px 0px 5px;
    background rgba(128,128,128,0.2);
  }
  .replyBox::before{
    content '';
    display block;
    position absolute;
    top:-15px;
    left:6px;
    border:8px solid rgba(128,128,128,0.2);
    border-top-color:transparent;
    border-left-color:transparent;
    border-right-color:transparent;
  }
  .replyItem{
    overflow hidden;
    padding:10px 5px;
  }
  .replyItem p{
    float left ;
    padding 0px 2px;
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
