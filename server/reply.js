const express=require('express');
const Router=express.Router();
const Reply=require("./model").getModel("reply");

Router.post("/addReply",(req,res)=>{
  const {commentId,userId,replyTxt}=req.body;
  Reply.create({commentId,userId,replyTxt},(err,data)=>{
    if(err){
      return res.json({code:1,msg:err});
    }
    res.json({code:0,data:data});
  })
});

Router.post("/selReply",(req,res)=>{
  const {commentId} =req.body;
  Reply.find({commentId},(err,data)=>{
    if(err){
      return res.json({code:1,msg:err});
    }
    return res.json({code:0,data:data});
  })
});

Router.post("/delReply",(req,res)=>{
  const {commentId} =req.body;
  Reply.find({commentId},(err,data)=>{
    if(err){
      return res.json({code:1,msg:err});
    }
    for(let i=data.length-1;i>=0;i--){
      Reply.remove({commentId},(err,rData)=>{
        if(err){
          return res.json({code:1,msg:err});
        }
      })
    }
    res.json({code:0,msg:"删除成功"});
  })
})

module.exports=Router;
