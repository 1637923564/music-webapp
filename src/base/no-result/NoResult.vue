<template>
  <div class="no-result">
    <span class="text">
      {{ info }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: String,
      default: '还没有任何东西'
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/mixin';
.no-result {
  position fixed
  width 100%
  bottom 0
  top 125px
  background rgb(250, 250, 250)
  flex-center()
  .text {
    font-size 20px
    margin-top -100px
  }
}
</style>
