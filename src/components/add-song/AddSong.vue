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
    <!-- 搜索结果 -->
    <div class="result-wrapper" v-show="query">
      <search-result :showSinger="false"
                     :query="query"
                     :playCurrentSong="playCurrentSong"
                     @selectResult="selectResult"
      />
    </div>
    <!-- 搜索历史 -->
    <scroll  ref="scrollSearch"
             class="history-wrapper"
             :tag="searchHistory"
             v-show="!query && currentSelect === 1"
    >
      <history-list :list="searchHistory"
                    @selectHistory="addQuery"
                    @removeOne="removeHistory"
      />
    </scroll>
    <!-- 播放历史 -->
    <scroll ref="scrollPlay"
            class="play-history-wrapper"
            :tag="playHistory"
            v-show="!query && currentSelect === 0"
    >
      <song-list class="song-list" @selectSong="selectSong"  :songs="playHistory" />
    </scroll>

    <top-tip info="歌曲添加成功" ref="topTip" />
  </div>
</transition>
</template>

<script>
import { searchMixin } from '../../common/util/mixin'

import SearchResult from '../search-result/SearchResult'
import SearchInput from '../../base/search-input/SearchInput'
import HistoryList from '../../base/history-list/HistoryList'
import ToggleButton from '../../base/toggle-button/ToggleButton'
import SongList from '../../base/song-list/SongList'
import Scroll from '../../base/scroll/Scroll'
import TopTip from '../../base/top-tip/TopTip'

import { mapState, mapActions } from 'vuex'

export default {
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      currentSelect: 0,
      playCurrentSong: true
    }
  },
  components: {
    SearchInput,
    SearchResult,
    HistoryList,
    ToggleButton,
    SongList,
    Scroll,
    TopTip
  },
  computed: {
    ...mapState(['playHistory', 'showPlaylist'])
  },
  methods: {
    selectResult(item) {
      this.$refs.topTip.show()
    },
    selectSong(song, index) {
      this.$refs.topTip.show()
      // 是否播放当前歌曲
      const playCurrentSong = this.playCurrentSong
      this.insertSong({ song, playCurrentSong })
    },
    toggleView(index) {
      this.currentSelect = index
    },
    show() {
      this.showFlag = true
    },
    fade() {
      this.showFlag = false
    },
    ...mapActions(['insertSong'])
  },
  watch: {
    currentSelect() {
      this.$refs.scrollSearch.refresh()
      this.$refs.scrollPlay.refresh()
    },
    showPlaylist(now) {
      if (!now) {
        this.showFlag = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';
.add-song {
  color #2c3e50
  z-index 20000
  position fixed
  top 0
  bottom 0
  width 100%
  background rgb(247,247,247)
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
      color #2c3e50
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
    position fixed
    top 175px
    bottom 0
    width 100%
    overflow hidden
    padding 0 30px
    box-sizing border-box
  }
  .play-history-wrapper {
    position fixed
    top 175px
    bottom 0
    width 100%
    overflow hidden
    .song-list {
      padding-top 0 !important
    }
  }
}
</style>
