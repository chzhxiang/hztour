<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  import BScroll from "better-scroll"
  export default {
    data(){
      return {
        dots:[],
        currentPageIndex:0
      }
    },
    props:{
      loop:{
        type:Boolean,
        default:true
      },
      autoPlay:{
        type:Boolean,
        default:true
      },
      interval:{
        type:Number,
        default:3000
      },
      data:{
        type:Array,
        default:[]
      }
    },
    mounted(){
      this.init();
    },
    methods:{
      //页面初始化
      init(){
        setTimeout(()=>{
          this._setSliderWidth();
          this._initSlider();
          if(this.autoPlay){
            this._play()
          }
        },20)
        window.addEventListener('resize',()=>{
          if(!this.slider){
            return;
          }
          this._setSliderWidth(true);
          this.slider.refresh();
        })
      },
      _setSliderWidth(isResize){
        this.children = this.$refs.sliderGroup.children;
        console.log("children");
        console.log(this.children);
        let width = 0;
        let sliderWidth = this.$refs.slider.clientWidth;
        for(let i=0;i<this.children.length;i++){
          let child = this.children[i];
          child.classList.add('slider-item');
          child.style.width = sliderWidth +"px";
          width +=sliderWidth;
        }
        if(this.loop&&!isResize){
          width+=2*sliderWidth;
        }
        this.$refs.sliderGroup.style.width = width + "px";
        this._initDots();
      },
      _initSlider(){
        this.slider = new BScroll(this.$refs.slider,{
          snap:{
            loop:this.loop,
            thrshold:0.1,
            speed:400
          },
          scrollX:true,
          momentum:false,
          click:true
        })
        this.slider.on('scrollEnd',()=>{
          let pageIndex = this.slider.getCurrentPage().pageX;
          if(this.loop){
            pageIndex-=1;
          }
          this.currentPageIndex = pageIndex;
          this.$emit("currentIndex",this.currentPageIndex);
          if(this.autoPlay){
            clearTimeout(this.timer);
            this._play();
            console.log(this.currentPageIndex);
          }
        })
      },
      _initDots(){
        if(this.loop){
          console.log(this.children.length);
          this.dots = new Array(this.children.length-2);
          console.log(this.dots);
        }else{
          this.dots = new Array(this.children.length);
        }
      },
      _play(){
        let pageIndex = this.currentPageIndex+1;
        if(this.loop){
          pageIndex+=1;
        }
        this.timer = setTimeout(()=>{
          this.slider.goToPage(pageIndex,0,400)
        },this.interval)
      }
    },
    watch: {
      data(val) {
        //console.log("banner");
        //console.log(val);
        this.init();
      }
    }
  }
</script>
<style scoped lang="stylus">
  .slider
    min-height: 1px
    position: relative
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          position relative
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
</style>
