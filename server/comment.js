const express=require('express');
const Router=express.Router();
const comment=require('./model').getModel('comment');

//添加评论
Router.post('/addComment',(req,res)=>{
  // console.log('7878778');
  const {userId,articleId,commentTxt,timer}=req.body;
  comment.create({userId,articleId,commentTxt,timer},(err,data)=>{
    if(err){
      return res.json({code:1,msg:err});
    }
    res.json({code:0,data:data});
  })
})

//查看评论
Router.post('/selComment',(req,res)=>{
  const {articleId}=req.body;
  comment.find({articleId},(err,data)=>{
    if(err){
      return res.json({code:1,msg:err});
    }
    res.json({code:0,data:data});
  })
})

//删除
Router.post('/removeComment',(req,res)=>{
  const {_id}=req.body;
  comment.remove({_id},(err,data)=>{
    if(err){
      return res.json({code:1,msg:err});
    }
    res.json({code:0,data:data});
  })
})

module.exports=Router;
