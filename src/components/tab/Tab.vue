<template>
  <div class="tab">
    <router-link to="/recommend" tag="div" class="tab-item">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link to="/singer" tag="div" class="tab-item">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link to="/rank" tag="div" class="tab-item">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link to="/search" tag="div" class="tab-item">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixin'
@import '../../common/stylus/variable'
.tab {
  display flex
  height 44px
  color $color-text-l
  font-size 14px
  .tab-item {
    flex 1
    height 100%
    flex-center()
    .tab-link {
      padding-bottom 5px}
    &.router-link-active>.tab-link {
      color: $color-theme
      border-bottom: 2px solid $color-theme}}}
</style>
