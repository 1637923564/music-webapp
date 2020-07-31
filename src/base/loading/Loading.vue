<template>
  <div class="loading">
    <img src="./loading.gif">
    <span class="text">{{ loadingInfo }}</span>
  </div>
</template>

<script>
export default {
  props: {
    loadingInfo: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.loading
  display flex
  flex-direction column
  align-items center
  font-size 15px
  img
    width 24px
    height 24px
    margin-bottom 5px
</style>
