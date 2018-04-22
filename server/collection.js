const express=require('express');
const formidable=require('formidable');
const fs=require('fs');
const Router=express.Router();
const Collection=require('./model').getModel('collection');

//添加收藏
Router.post('/addCollection',(req,res)=>{
  // console.log('addCollection');
  // console.log(req.body);
  const {articleId,userId,articleName,articleImg}=req.body;
  Collection.find({articleId,userId},(err,data)=> {
    if (err) {
      return res.json({"code": 1, "msg": err});
    }
    // console.log(data.length);
    if (data.length > 0) {
      return res.json({code: 1, msg: "该文章已被您收藏！"});
    }else {
      Collection.create({articleId,userId,articleName,articleImg},(err,travelsInfo)=> {
        if (err) {
          return res.json({code: 1, msg: err});
        }
        return res.json({code: 0, 'data': travelsInfo});
      });
    }
  });
});

//查看收藏
Router.post('/selCollection',(req,res)=>{
  // console.log('selCollection');
  // console.log(req.body);
  const {userId}=req.body;
  Collection.find({userId},(err,data)=> {
    if (err) {
      return res.json({"code": 1, "msg": err});
    }
    // console.log(data.length);
    return res.json({code: 0, 'data': data});
  });
});

//根据文章id查看收藏
Router.post('/selCollectionId',(req,res)=>{
  // console.log('selCollection');
  // console.log(req.body);
  const {articleId}=req.body;
  Collection.find({articleId},(err,data)=> {
    if (err) {
      return res.json({"code": 1, "msg": err});
    }
    // console.log(data.length);
    return res.json({code: 0, 'data': data});
  });
});

//删除收藏
Router.post('/delCollection',(req,res)=>{
  // console.log('delCollection');
  // console.log(req.body);
  const {_id}=req.body;
  Collection.remove({_id},(err,data)=> {
    if (err) {
      return res.json({"code": 1, "msg": err});
    }
    // console.log(data.length);
    return res.json({code: 0, 'msg': "删除成功！"});
  });
});

//_id收藏
Router.post('/selCollection1',(req,res)=>{
  // console.log('delCollection');
  // console.log(req.body);
  const {_id}=req.body;
  Collection.find({_id},(err,data)=> {
    if (err) {
      return res.json({"code": 1, "msg": err});
    }
    // console.log(data.length);
    return res.json({code: 0, data:data});
  });
});

//删除个人收藏
Router.post('/selUserIdCollection1',(req,res)=>{
  // console.log('delCollection');
  // console.log(req.body);
  const {userId}=req.body;
  Collection.remove({userId},(err,data)=> {
    if (err) {
      return res.json({"code": 1, "msg": err});
    }
    return res.json({code: 0, data:data});
  });
});

module.exports=Router;
