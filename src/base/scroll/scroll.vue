<template>
  <div ref="scroll">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from "better-scroll";
    export default {
        name: "scorll",
      props:{
        probeType:{
          type:Number,
          default:1
        },
        click:{
          type:Boolean,
          default:true
        },
        data:{
          type:Array,
          default:null
        },
        listenScroll:{
          type:Boolean,
          default:false
        }
      },
      mounted(){
        setTimeout(()=>{
          this._initScroll();
        },20);
      },
      methods:{
        _initScroll(){
          if(!this.$refs.scroll){
            return ;
          }
          this.scroll=new BScroll(this.$refs.scroll,{
            probeType:this.probeType,
            click:this.click
          })
          if(this.listenScroll){
            this.scroll.on('scroll',(pos)=>{
              this.$emit('scroll',pos);
            })
          }
        },
        refresh(){
          this.scroll&&this.scroll.refresh();
        },
        scrollTo(){
          this.scroll&&this.scrollTo.apply(this.scroll,arguments);
        },
        scrollToElement(){
          this.scroll&&this.scrollToElement.apply(this.scroll,arguments);
        }
      },
      watch:{
        data(){
          this._initScroll();
          setTimeout(()=>{
            this.refresh();
          },20);
        }
      }
    }
</script>

<style scoped>

</style>
