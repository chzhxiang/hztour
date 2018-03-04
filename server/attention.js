const express=require('express');
const formidable=require('formidable');
const fs=require('fs');
const Router=express.Router();
const attention=require('./model').getModel('attention');

//添加关注
Router.post('/addCollection',(req,res)=>{
  console.log('addCollection');
  const {authorId}=req.body;
  Collection.find({authorId},(err,data)=> {
    if (err) {
      return res.json({"code": 1, "msg": err});
    }
    console.log(data.length);
    if (data.length > 0) {
      return res.json({code: 1, msg: "该文章已被您收藏！"});
    }else {
      let {articleId,authorId,articleName,articleImg}=req.body;
      Collection.create({articleId,authorId,articleName,articleImg},(err,travelsInfo)=> {
        if (err) {
          return res.json({code: 1, msg: err});
        }
        return res.json({code: 0, 'msg': travelsInfo});
      });
    }
  });
});

module.exports=Router;
