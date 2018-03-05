<template>
    <div>
      attention
    </div>
</template>

<script>
  import axios from "axios";
    export default {
        name: "attention",
      data(){
          return{

          }
      },
      created(){
        if(window.localStorage.getItem("userInfo")){
          console.log("selAttention");
          axios.post("/attention/selAttention",{
            userId:JSON.parse(window.localStorage.getItem("userInfo"))[0].id
          }).then((res)=>{
            console.log(res.data);
          })
        }
      },
      methods:{

      }
    }
</script>

<style scoped>

</style>
