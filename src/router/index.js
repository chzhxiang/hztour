import Vue from "vue";
import VueRouter from "vue-router";
import My from "@/components/my/my";
import Season from "@/components/season/season";
import Travels from "@/components/travels/travels";
import Viewspot from "@/components/viewspot/viewspot";
//登录
import Login from "@/components/my/login";
//注册
import Rigster from "@/components/my/rigster";
//忘记密码
import ForgetPwd from "@/components/my/forget_pwd";
//修改个人信息
import UpdataInfo from "@/components/my/updata_info"
//写游记
import WriteTravels from "@/components/my/write_travels";
//我的游记
import MyTravels from "@/components/my/my_travels";
//编辑
import UpdataTravels from "@/components/my/updata_travels";
//收藏
import Collection from "@/components/my/collection";
//关注
import Attention from "@/components/my/attention";

Vue.use(VueRouter);
export default new VueRouter({
  routes:[
    {
      path:"/",
      redirect:"/travels"
    },{
      path:"/travels",
      component:Travels
    },{
      path:"/viewspot",
      component:Viewspot
    },{
      path:"/season",
      component:Season
    },{
      path:"/my",
      component:My
    },{
      path:'/my/attention',
      component:Attention
    },{
      path:'/my/collection',
      component:Collection
    },{
      path:'/my/login',
      component:Login
    },{
      path:'/my/rigster',
      component:Rigster
    },{
      path:'/my/forgetPwd',
      component:ForgetPwd
    },{
      path:'/my/updataInfo',
      component:UpdataInfo
    },{
      path:'/my/writeTravels',
      component:WriteTravels
    },{
      path:"/my/myTravels",
      component:MyTravels
    },{
      path:"/my/updataTravels",
      component:UpdataTravels
    }
  ]
})
