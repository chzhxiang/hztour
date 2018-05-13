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
app.use('/encourage',Encourage)

   io.on('connection',(socket)=>{
     socket.on('sendmsg',(data)=>{
       const {chatId,txt}=data;
       Chat.create({'t':new Date().getTime(),chatId,txt},(err,doc)=>{
         if(err){
           console.log(err);
           return ;
         }
         if(!err){
			 console.log("123");
           io.emit("recvmsg",doc);
		   return;
         }
       })
     })
   })

server.listen(9090,"localhost",()=>{
  console.log('node app start at port 9090');
})
