const express=require('express');
const app=express();
const server=require('http').createServer(app);
const io=require('socket.io')(server);
const bodyParser=require('body-parser');
const userRouter=require('./user');
const travelsRouter=require('./travels');
const collectionRouter=require('./collection');
const attentionRouter=require('./attention');
const viewSpotRouter=require('./viewSpot');
const CommentRouter=require('./comment');
const Reply=require('./reply');
const Encourage=require("./encourage");
const Chat=require('./model').getModel('chat');
const Chats=require('./chats');

app.all('*',(req, res, next)=>{
  res.header("Access-Control-Allow-Methods", "POST");
  next();
});

app.use(express.static("./"));

app.use(bodyParser());

app.use('/user',userRouter);
app.use('/travels',travelsRouter);
app.use('/collection',collectionRouter);
app.use('/attention',attentionRouter);
app.use('/viewSpot',viewSpotRouter);
app.use('/comment',CommentRouter);
app.use('/reply',Reply);
app.use('/encourage',Encourage);
app.use("/chat",Chats)

   io.on('connection',(socket)=>{
     socket.on('sendmsg',(data)=>{
       const {from,txt,to,userAva,userName}=data;
       Chat.create({'t':new Date().getTime(),from,to,txt,'readFlag':false,userAva,userName},(err,doc)=>{
         if(err){
           console.log(err);
           return ;
         }
         if(!err){
           io.emit("recvmsg",doc);
           return;
         }
       })
     })
   })

server.listen(9090,"localhost",()=>{
  console.log('node app start at port 9090');
})
