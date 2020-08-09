<template>
<transition name="slide">
  <div class="add-song" @click.stop v-show="showFlag">
    <div class="top-wrapper">
      <span class="title">添加歌曲到列表</span>
      <span class="back">
        <i class="icon-close" @click="fade"></i>
      </span>
    </div>
    <div class="input-wrapper">
      <search-input ref="input" placeholder="搜索歌曲" @getQuery="getQuery" />
    </div>
    <div class="toggle-wrapper"  v-show="!query">
      <toggle-button :btnTitle="['最近播放', '搜索历史']"
                     @selectBtn="toggleView"
                     :currentSelect="currentSelect"
      />
    </div>
    <div class="result-wrapper" v-show="query">
      <search-result :showSinger="false" :query="query" />
    </div>
    <div class="history-wrapper" v-show="!query && currentSelect === 1">
      <history-list :list="searchHistory"
                    @selectHistory="addQuery"
                    @removeOne="removeHistory"
      />
    </div>
  </div>
</transition>
</template>

<script>
import { searchMixin } from '../../common/util/mixin'

import SearchResult from '../search-result/SearchResult'
import SearchInput from '../../base/search-input/SearchInput'
import HistoryList from '../../base/history-list/HistoryList'
import ToggleButton from '../../base/toggle-button/ToggleButton'

export default {
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      currentSelect: 0
    }
  },
  components: {
    SearchInput,
    SearchResult,
    HistoryList,
    ToggleButton
  },
  methods: {
    toggleView(index) {
      this.currentSelect = index
    },
    show() {
      this.showFlag = true
    },
    fade() {
      this.showFlag = false
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';
.add-song {
  color $color-text-l
  z-index 20000
  position fixed
  top 0
  bottom 0
  width 100%
  background $color-background
  &.slide-enter-active, &.slide-leave-active {
    transition all .3s linear
  }
  &.slide-enter, &.slide-leave-to {
    transform translateX(100%)
  }
  .top-wrapper {
    height 44px
    .title {
      display inline-block
      width 100%
      text-align center
      line-height 44px
      font-size 18px
    }
    .back {
      position absolute
      display inline-block
      right 0
      width 44px
      height 44px
      text-align center
      line-height 44px
      padding-right 7px
      color $color-theme
      font-size 20px
    }
  }
  .toggle-wrapper {
    display flex
    justify-content center
  }
  .result-wrapper {
    position fixed
    top 125px
    width 100%
    bottom -60px
  }
  .history-wrapper {
    margin-top 25px
    padding 0 30px
  }
}
</style>
