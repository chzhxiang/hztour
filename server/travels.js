const express=require('express');
const formidable=require('formidable');
const fs=require('fs');
const Router=express.Router();
const Travels=require('./model').getModel('travels');
const TravelsImg=require('./model').getModel('travelsImg');

//提交
Router.post('/register',(req,res)=>{
  console.log('register');
  Travels.find({articleName:req.body.articleName},(err,data)=> {
    if (err) {
      return res.json({"code": 1, "msg": err});
    }
    console.log(data.length);
    if (data.length > 0) {
      return res.json({code: 1, msg: "该文章名已存在！"});
    }else {
      let {author,articleName,articleContent,flag,articleTime}=req.body;
      Travels.create({author,articleName,articleContent,flag,articleTime},(err,travelsInfo)=> {
        if (err) {
          return res.json({code: 1, msg: err});
        }
        return res.json({code: 0, data: travelsInfo});
      });
    }
  });
});

//上传文件
Router.post('/upFile',(req,res)=>{
  let form = new formidable.IncomingForm();
  form.uploadDir = "./static/travels";
  form.keepExtensions = true;
  form.parse(req, (err, fields, files)=>{
    if(err){
      console.log(err);
      return res.json({'code':1,'msg':"图片上传失败！"});
    }
    console.log("flag");
    console.log(fields.flag);
    TravelsImg.create({"path":files.file.path,"flag":fields.flag},(err,data)=>{
      if(err){
        return res.json({'code':1,'msg':err});
      }
    });
    res.json({'code':0,"avatar":files.file.path});
  });
});

//删除文件
Router.post('/delFile',(req,res)=>{
  const {flag}=req.body;
  console.log(flag);
  TravelsImg.find({flag},(err,data)=> {
    if (err) {
      return res.json({"code": 1, "msg": err});
    }
    console.log("data");
    console.log(data);
    if(data.length>0){
      for(let i=0;i<data.length;i++){
        TravelsImg.remove({flag},(err,data)=>{
          if(err){
            return res.json({'code':1,'msg':err});
          }
          res.json({'code':0,"msg":"删除成功！"});
        });
        fs.unlinkSync(data[i].path,(err)=>{
          if(err){
            return res.json({'code':1,'msg':err});
          }
        });
      }
    }
  });
});

//查游记
Router.post('/selTravels',(req,res)=>{
  Travels.find({author:req.body.author},(err,data)=> {
    if(err){
      return res.json({'code':1,'msg':err});
    }
    return res.json({'code':0,'data':data});
  });
});

//查图片
Router.post('/selTravelsimg',(req,res)=>{
  const {flag}=req.body;
  TravelsImg.find({flag},(err,data)=> {
    if(err){
      return res.json({'code':1,'msg':err});
    }
    return res.json({'code':0,'data':data});
  });
});

//删除
Router.post('/delTravels',(req,res)=>{
  const {articleName}=req.body;
  Travels.remove({articleName},(err,data)=>{
    if(err){
      return res.json({'code':1,'msg':err});
    }
    res.json({'code':0,"msg":"删除成功！"});
  });
});

//修改
Router.post('/upTravels',(req,res)=>{
  const {_id,articleName,articleContent,articleTime}=req.body;
  Travels.update({_id},{$set:{articleName,articleContent,articleTime}},(err,data)=>{
    if(err){
      return res.json({code:1,msg:err});
    }
    return res.json({code:0,msg:"成功！"});
  })
});

module.exports=Router;
