const express=require('express');
const Router=express.Router();
const Chats=require('./model').getModel('chat');

//清空记录
Router.post('/del',(req,res)=>{
  const {from,to}=req.body;
  Chats.remove({from,to},(err,data)=>{
    if(err){
      return res.json({code:1,msg:err});
    }
    res.json({code:0,msg:data});
  })
});

//查找
Router.post("/selF",(req,res)=>{
  const {from}=req.body;
  Chats.find({from},(err,data)=>{
    if(err){
      return res.json({code:1,data:data});
    }
    res.json({code:0,data:data});
  })
});
Router.post("/selT",(req,res)=>{
  const {to}=req.body;
  Chats.find({to},(err,data)=>{
    if(err){
      return res.json({code:1,data:data});
    }
    res.json({code:0,data:data});
  })
});

//修改阅读标记
Router.post("/upd",(req,res)=>{
  const {_id,readFlag}=req.body;
  Chats.update({_id},{$set:{readFlag}},(err,data)=>{
    if(err){
      return res.json({code:1,data:err});
    }
    res.json({code:0,data:data});
  })
});

module.exports=Router;
