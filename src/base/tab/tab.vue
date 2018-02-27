<template>
  <div class="bar">
    <router-link tag="div" to="/travels" class="bar-item">
      <span class="tab-link">游记</span>
    </router-link>
    <router-link tag="div" to="/season" class="bar-item">
      <span class="tab-link">当季</span>
    </router-link>
    <router-link tag="div" to="/viewspot" class="bar-item">
      <span class="tab-link">景点</span>
    </router-link>
    <router-link tag="div" to="/my" class="bar-item">
      <span class="tab-link">我的</span>
    </router-link>
  </div>
</template>
<script>
  export default{

  }
</script>
<style scoped lang="stylus">
  .bar
    overflow: hidden
    .bar-item
      line-height:40px
      width: 25%
      text-align:center
      float:left
      &.router-link-active
        .tab-link
          color rgb(0,126,224)
</style>
