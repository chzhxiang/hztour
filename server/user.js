const express=require('express');
const formidable=require('formidable');
const fs=require('fs');
const Router=express.Router();
const User=require('./model').getModel('user');
const UserImg=require('./model').getModel('userImg')

//注册
Router.post('/register',(req,res)=>{
  console.log('register');
  User.find({userName:req.body.userName},(err,data)=> {
    if (err) {
      return res.json({"code": 1, "msg": err});
    }
    console.log(data.length);
    if (data.length > 0) {
      return res.json({code: 1, msg: "该昵称已存在！"});
    }else {
      let {userName,pwd,avatar,problem,answer}=req.body;
      User.create({userName,pwd,avatar,problem,answer},(err,registerInfo)=> {
        if (err) {

          return res.json({code: 1, msg: "注册失败请重新注册！"});
        }
        const _id = registerInfo._id;
        return res.json({code: 0, data: {userName, _id, avatar}});
      });
    }
  });
});

//上传文件
Router.post('/upload',(req,res)=>{
  console.log("UserImg");
  let form = new formidable.IncomingForm();
  form.uploadDir = "./static/upload";
  form.keepExtensions = true;
  form.parse(req, (err, fields, files)=>{
    if(err){
      console.log(err);
      return res.json({'code':1,'msg':"图片上传失败！"});
    }
    // console.log(90909090);
    console.log(fields.imgName);
    UserImg.create({'userName':fields.name,"path":files.file.path,"img":fields.imgName},(err,data)=>{
      if(err){
        return res.json({'code':1,'msg':err});
      }
    });
    res.json({'code':0,"avatar":files.file.path});
  });
});

//登录
Router.post('/login',(req,res)=>{
  const {userName,pwd}=req.body;
  console.log(req.body);
  User.find({userName,"pwd":pwd},{pwd:0,__v:0,answer:0,problem:0},(err,data)=>{
    if(err){
      res.json({code:1,msg:err});
      return ;
    }
    console.log("login");
    console.log(data);
    if(data.length===0){
      res.json({code:1,msg:"用户名和密码不匹配！"});
      return ;
    }
    return res.json({code:0,data:data});
  })
});

//忘记密码
Router.post('/forget',(req,res)=>{
  const {userName,problem,answer}=req.body;
  console.log(req.body);
  User.find({userName,problem,answer},(err,data)=>{
    if(err){
      return res.json({code:1,msg:err});
    }
    if(data.length===0){
      return res.json({code:1,msg:"用户名不存在或者密保与密码不匹配！"});
    }
    return res.json({code:0,msg:"成功！"});
  })
});

//忘记密码->修改密码
Router.post('/forgetup',(req,res)=>{
  const {userName,pwd}=req.body;
  console.log(req.body);
  User.update({userName},{$set:{pwd}},(err,data)=>{
    if(err){
      return res.json({code:1,msg:err});
    }
    return res.json({code:0,msg:"成功！"});
  })
});

//修改密码
Router.post('/upPwd',(req,res)=>{
  const {_id,pwd,nPwd}=req.body;
  console.log(req.body);
  // User.update({userName},{$set:{pwd}},(err,data)=>{
  //   if(err){
  //     return res.json({code:1,msg:err});
  //   }
  //   return res.json({code:0,msg:"成功！"});
  // })
});

//修改基本信息
Router.post('/up',(req,res)=>{
  const {_id,userName,avatar}=req.body;
  console.log(req.body);
  // User.update({userName},{$set:{pwd}},(err,data)=>{
  //   if(err){
  //     return res.json({code:1,msg:err});
  //   }
  //   return res.json({code:0,msg:"成功！"});
  // })
});

//获取图片文件信息
Router.post('/reqAvatar',(req,res)=>{
  console.log(req.query);
  const {img}=req.body;
  UserImg.findOne({img}, (err, dataUserImg) => {
    if (err) {
      return res.json({"code": 1, msg: err});
    }
    return res.json({code:0,msg:dataUserImg});
      console.log(dataUserImg);
    })
});

module.exports=Router;
