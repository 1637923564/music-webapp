<template>
  <div class="m-header">
    <div class="logo"></div>
    <div class="title">OwnMusic</div>
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
  color #2c3e50
  display flex
  align-items center
  .logo {
    display inline-block
    margin-left 11px
    width 40px
    height 44px
    margin-right 1px
    background-image url('./logo1.png')
    background-size 40px 40px
  }
  .title {
    font-size 21px
    color #22d59c
  }
  .center-btn {
    position absolute
    right 0
    padding-right 14px
    font-size 20px
  }
}
</style>
