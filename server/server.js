const express=require('express');
const app=express();
const server=require('http').createServer(app);
const io=require('socket.io')(server);
const bodyParser=require('body-parser');
const userRouter=require('./user');
const travelsRouter=require('./travels');

app.all('*',(req, res, next)=>{
  res.header("Access-Control-Allow-Methods", "POST");
  next();
});

app.use(express.static("./"));

app.use(bodyParser());

app.use('/user',userRouter);
app.use('/travels',travelsRouter);

io.on('connection',(socket)=>{
  socket.on('sendmsg',(data)=>{
    const {from,to,msg}=data;
    const chatid=[from,to].sort().join('_');
    Chat.create({chatid,from,to,content:msg,'create_time':new Date().getTime()},(err,doc)=>{
      if(err){
        console.log(err);
        return ;
      }
      if(!err){
        return io.emit("recvmsg",doc);
      }
    })
  })
})

server.listen(9090,"localhost",()=>{
  console.log('node app start at port 9090');
})
