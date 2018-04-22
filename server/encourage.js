const express=require('express');
const Router=express.Router();
const Encourage=require("./model").getModel("encourage");

Router.post("/addEncourage",(req,res)=>{
  const {articleId,userId}=req.body;
  Encourage.create({articleId,userId},(err,data)=>{
    if(err){
      return res.json({code:1,msg:err});
    }
    res.json({code:0,data:data});
  })
})

Router.post("/selEncourage",(req,res)=>{
  const {articleId}=req.body;
  Encourage.find({articleId},(err,data)=>{
    if(err){
      return res.json({code:1,msg:err});
    }
    res.json({code:0,data:data});
  })
})

Router.post("/selYEncourage",(req,res)=>{
  const {articleId,userId}=req.body;
  Encourage.find({articleId,userId},(err,data)=>{
    if(err){
      return res.json({code:1,msg:err});
    }
    res.json({code:0,data:data});
  })
})

module.exports=Router;
