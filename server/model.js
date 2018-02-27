const mongoose=require('mongoose');
const DB_URL='mongodb://localhost/hztour';
mongoose.connect(DB_URL);

const models={
  user:{
    'userName':{'type':String,'require':true},
    'pwd':{'type':String,'require':true},
    'avatar':{'type':String},
    'problem':{'type':String,'require':true},
    'answer':{'type':String,'require':true}
  },
  userImg:{
    'userName':{'type':String,'require':true},
    'path':{'type':String,'require':true},
    'img':{'type':String,'require':true}
  },
  collection:{
    'author':{'type':String,'require':true},
    'articleName':{'type':String,'require':true},
    'articleImg':{'type':String}
  },
  attention:{
    'author':{'type':String,'require':true},
    'authorImg':{'type':String}
  },
  travels:{
    'author':{'type':String,'require':true},
    'articleName':{'type':String,'require':true},
    'articleContent':{'type':String,'require':true},
    'flag':{'type':String},
    'articleTime':{'type':String,'require':true}
  },
  travelsImg:{
    'path':{'type':String,'require':true},
    'flag':{'type':String,'require':true}
  }
}

for(let m in models){
  mongoose.model(m,new mongoose.Schema(models[m]));
}

mongoose.connection.on('connected',()=>{
  console.log("server connected successful");
})

module.exports={
  getModel:function (name) {
    return mongoose.model(name);
  }
}
