<template>
  <div class="headerBox">
    <img src="./logo.png" class="logoBox"/>
  </div>
</template>

<script>
    export default {
        name: "hz_header"
    }
</script>

<style scoped>
.headerBox{
  background: skyblue;
  width: 100%;
  overflow: hidden;
  height: 52px;
  position: relative;
}
  .logoBox{
    position: absolute;
    top: 0px;
    left: 50%;
    margin-left: -58px;
  }
</style>
