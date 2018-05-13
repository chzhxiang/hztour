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
    'articleId':{'type':String,'require':true},
    'userId':{'type':String,'require':true},
    'articleName':{'type':String,'require':true},
    'articleImg':{'type':String}
  },
  attention:{
    'authorId':{'type':String,'require':true},
    'userId':{'type':String,'require':true}
  },
  travels:{
    'author':{'type':String,'require':true},
    'authorId':{'type':String,'require':true},
    'articleName':{'type':String,'require':true},
    'articleContent':{'type':String,'require':true},
    'flag':{'type':String},
    'articleTime':{'type':String,'require':true}
  },
  travelsImg:{
    'path':{'type':String,'require':true},
    'flag':{'type':String,'require':true}
  },
  admin:{
    'userName':{'type':String,'require':true},
    'pwd':{'type':String,'require':true}
  },
  viewSpot:{
    'authorId':{'type':String,'require':true},
    'articleName':{'type':String,'require':true},
    'articleContent':{'type':String,'require':true},
	  'season':{'type':String,'require':true},
    'flag':{'type':String}
  },
  viewSpotImg:{
    'path':{'type':String,'require':true},
    'flag':{'type':String,'require':true}
  },
  comment:{
    'userId':{'type':String,'require':true},
    'articleId':{'type':String,'require':true},
    'commentTxt':{'type':String,'require':true},
    'timer':{'type':String,'require':true}
  },
  reply:{
    'commentId':{'type':String,'require':true},
    'userId':{'type':String,'require':true},
    'replyTxt':{'type':String,'require':true}
  },
  customerService:{
    'userId':{'type':String,'require':true},
    'txt':{'type':String,'require':true}
  },
  encourage:{
    'articleId':{'type':String,'require':true},
    'userId':{'type':String}
  },
  chat:{
  	't':{'type':String,'require':true},
  	'chatId':{'type':String,'require':true},
  	'txt':{'type':String,'require':true},
	'readFlag':{'type':Boolean,'require':true}
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
