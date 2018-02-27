<template>
    <div>
      <carousel :auto="3000">
        <div v-for="item in bannerImg">
          <img :src="item"/>
        </div>
      </carousel>
    </div>
</template>

<script>
  import Carousel from "vue-m-carousel";
    export default {
        name: "travels",
      data(){
          return{
            bannerImg:['http://localhost:8080/static/imgs/banner/banner8.jpg',
              'http://localhost:8080/static/imgs/banner/banner9.jpg',
              'http://localhost:8080/static/imgs/banner/banner10.jpg',
              'http://localhost:8080/static/imgs/banner/banner11.jpg',
              'http://localhost:8080/static/imgs/banner/shuiche.jpg']
          }
      },
      components:{
        Carousel
      }
    }
</script>

<style scoped>

</style>
