const express=require('express');
const formidable=require('formidable');
const fs=require('fs');
const Router=express.Router();
const Attention=require('./model').getModel('attention');

//添加关注
Router.post('/addAttention',(req,res)=>{
  console.log('addAttention');
  const {authorId,userId}=req.body;
  Attention.find({authorId,userId},(err,data)=> {
    if (err) {
      return res.json({"code": 1, "msg": err});
    }
    console.log(data);
    if (data.length > 0) {
      return res.json({code: 1, msg: "该创造者已被您关注！"});
    }else {
      Attention.create({authorId,userId},(err,travelsInfo)=> {
        if (err) {
          return res.json({code: 1, msg: err});
        }
        return res.json({code: 0, 'data': travelsInfo});
      });
    }
  });
});

//查看关注
Router.post('/selAttention',(req,res)=>{
  console.log('selCollection');
  console.log(req.body);
  const {userId}=req.body;
  Attention.find({userId},(err,data)=> {
    if (err) {
      return res.json({"code": 1, "msg": err});
    }
    console.log(data.length);
    return res.json({code: 0, 'data': data});
  });
});

module.exports=Router;
