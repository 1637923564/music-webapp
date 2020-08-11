<template>
  <div class="m-header">
    <div class="logo"></div>
    <div class="title">Chicken Music</div>
    <div class="center-btn">
      <router-link to="/center" tag="i" class="icon-mine"></router-link>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/variable'
@import '../../common/stylus/mixin'
.m-header {
  height 44px
  color $color-theme
  flex-center()
  .logo {
    display inline-block
    width 30px
    height 32px
    margin-right 9px
    bg-img('./logo')
    background-size 30px 32px
  }
  .title {
    font-size $font-size-large
  }
  .center-btn {
    position absolute
    right 0
    padding-right 14px
    font-size 20px
  }
}
</style>
