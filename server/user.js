const express=require('express');
const formidable=require('formidable');
const fs=require('fs');
const Router=express.Router();
const User=require('./model').getModel('user');
const UserImg=require('./model').getModel('userImg');
const Admin=require('./model').getModel('admin');

//注册
Router.post('/register',(req,res)=>{
  // console.log('register');
  User.find({userName:req.body.userName},(err,data)=> {
    if (err) {
      return res.json({"code": 1, "msg": err});
    }
    // console.log(data.length);
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

//管理员注册
Router.post('/adminRegister',(req,res)=>{
  // console.log('adminRegister');
  Admin.find({userName:req.body.userName},(err,data)=> {
    if (err) {
      return res.json({"code": 1, "msg": err});
    }
    // console.log(data.length);
    if (data.length > 0) {
      return res.json({code: 1, msg: "该昵称已存在！"});
    }else {
      let {userName,pwd}=req.body;
      Admin.create({userName,pwd},(err,registerInfo)=> {
        if (err) {

          return res.json({code: 1, msg: "注册失败请重新注册！"});
        }
        const _id = registerInfo._id;
        return res.json({code: 0, data: {userName, _id}});
      });
    }
  });
});

//管理员登录
Router.post('/adminLogin',(req,res)=>{
  const {userName,pwd}=req.body;
  // console.log(req.body);
  Admin.find({userName,"pwd":pwd},{pwd:0,__v:0,answer:0,problem:0},(err,data)=>{
    if(err){
      res.json({code:1,msg:err});
      return ;
    }
    // console.log("login");
    // console.log(data);
    if(data.length===0){
      res.json({code:1,msg:"用户名和密码不匹配！"});
      return ;
    }
    return res.json({code:0,data:data});
  })
});

//上传文件
Router.post('/upload',(req,res)=>{
  // console.log("UserImg");
  let form = new formidable.IncomingForm();
  form.uploadDir = "./static/upload";
  form.keepExtensions = true;
  form.parse(req, (err, fields, files)=>{
    if(err){
      // console.log(err);
      return res.json({'code':1,'msg':"图片上传失败！"});
    }
    // console.log(90909090);
    // console.log(fields.imgName);
    UserImg.remove({"img":fields.imgName},(err,data)=>{
      if(err){
        return res.json({'code':1,'msg':err});
      }
      // console.log("remove");
      // console.log(data);
      UserImg.create({'userName':fields.name,"path":files.file.path,"img":fields.imgName},(err,creadData)=>{
        if(err){
          return res.json({'code':1,'msg':err});
        }
        // console.log("creadData");
        // console.log(creadData);
        return res.json({'code':0,'msg':'成功'});
      });
    });
    // res.json({'code':0,"avatar":files.file.path});
  });
});

//登录
Router.post('/login',(req,res)=>{
  const {userName,pwd}=req.body;
  // console.log(req.body);
  User.find({userName,"pwd":pwd},{pwd:0,__v:0,answer:0,problem:0},(err,data)=>{
    if(err){
      res.json({code:1,msg:err});
      return ;
    }
    // console.log("login");
    // console.log(data);
    if(data.length===0){
      res.json({code:1,msg:"用户名和密码不匹配！"});
      return ;
    }
    return res.json({code:0,data:data});
  })
});

//根据_id查用户信息
Router.post('/selUser',(req,res)=>{
  const {_id}=req.body;
  // console.log(req.body);
  User.find({_id},{pwd:0,__v:0,answer:0,problem:0},(err,data)=>{
    if(err){
      res.json({code:1,msg:err});
      return ;
    }
    return res.json({code:0,data:data});
  })
});

//根据用户名查用户
Router.post('/selUsername',(req,res)=>{
  const {userName}=req.body;
  // console.log(req.body);
  User.find({userName},{pwd:0,__v:0,answer:0,problem:0},(err,data)=>{
    if(err){
      res.json({code:1,msg:err});
      return ;
    }
    return res.json({code:0,data:data});
  })
});

//忘记密码
Router.post('/forget',(req,res)=>{
  const {userName,problem,answer}=req.body;
  // console.log(req.body);
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
  // console.log(req.body);
  User.update({userName},{$set:{pwd}},(err,data)=>{
    if(err){
      return res.json({code:1,msg:err});
    }
    return res.json({code:0,msg:"成功！"});
  })
});

//修改密码
Router.post('/upPwd',(req,res)=>{
  const {_id,pwd,npwd}=req.body;
  // console.log(req.body);
  User.update({_id,pwd},{$set:{'pwd':npwd}},(err,data)=>{
    if(err){
      return res.json({code:1,msg:err});
    }
    if(!data){
      return res.json({code:1,msg:"旧密码不正确！"});
    }
    return res.json({code:0,msg:"密码修改成功！"});
  })
});

//修改基本信息
Router.post('/upBaseInfo',(req,res)=>{
  const {_id,userName,nUserName}=req.body;
  // console.log(req.body);
  User.update({_id,userName},{$set:{'userName':nUserName}},(err,data)=>{
    if(err){
      return res.json({code:1,msg:err});
    }
    return res.json({code:0,msg:"成功！"});
  })
});

//获取图片文件信息
Router.post('/reqAvatar',(req,res)=>{
  // console.log(req.query);
  const {img}=req.body;
  UserImg.findOne({img}, (err, dataUserImg) => {
    if (err) {
      return res.json({"code": 1, msg: err});
    }
    return res.json({code:0,data:dataUserImg});
      // console.log(dataUserImg);
    })
});

//删除头像
Router.post('/delAvatar',(req,res)=>{
  // console.log("delAvatar");
  const {flag}=req.body;
  UserImg.find({'img':flag},(err,data)=> {
    if (err) {
      return res.json({"code": 1, "msg": err});
    }
    // console.log("data");
    // console.log(data);
    if(data.length>0){
      for(let i=0;i<data.length;i++){
        fs.unlinkSync(data[i].path,(err)=>{
          if(err){
            // console.log(err);
            return ;
          }
        });
      }
    }
  });
});

//修改头像
Router.post('/reUpload',(req,res)=>{
  // console.log("reUpload");
  let form = new formidable.IncomingForm();
  form.uploadDir = "./static/upload";
  form.keepExtensions = true;
  form.parse(req, (err, fields, files)=>{
    if(err){
      // console.log(err);
      return res.json({'code':1,'msg':"图片上传失败！"});
    }
    // console.log(90909090);
    // console.log(fields.imgName);
    UserImg.update({'img':fields.flag},{$set:{'path':files.file.path}},(err,data)=>{
      if(err){
        return res.json({code:1,msg:err});
      }
      return res.json({code:0,msg:"成功！"});
    });
    res.json({'code':0,"avatar":files.file.path});
  });
});

module.exports=Router;
