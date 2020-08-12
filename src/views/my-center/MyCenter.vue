<template>
<transition name="slide">
  <div class="my-center">
    <div class="top-wrapper">
      <div class="back">
        <i class="icon-back" @click="goBack"></i>
      </div>
      <div class="toggle-wrapper">
        <toggle-button :btnTitle="['我喜欢的', '最近听的']"
                       @selectBtn="selectBtn"
                       :currentSelect="currentSelect"
        />
      </div>
    </div>
    <div class="btn" @click="randomPlay">
      <span class="icon">
        <i class="icon-play"></i>
      </span>
      <span class="text">随机播放全部</span>
    </div>
    <!-- 收藏栏 -->
    <scroll ref="collectScroll"
            class="collect-wrapper"
            :tag="collectList"
            v-show="currentSelect === 0"
    >
      <song-list :songs="collectList" @selectSong="playCollectSong" />
    </scroll>
    <!-- 近期播放 -->
    <scroll ref="recentPlayScroll"
            class="recent-play-wrapper"
            :tag="playHistory"
            v-show="currentSelect === 1"
    >
      <song-list :songs="playHistory" @selectSong="playRecentSong" />
    </scroll>
    <no-result v-show="showNoResult" :info="noResultInfo" />
  </div>
</transition>
</template>

<script>
import ToggleButton from '../../base/toggle-button/ToggleButton'
import SongList from '../../base/song-list/SongList'
import Scroll from '../../base/scroll/Scroll'
import NoResult from '../../base/no-result/NoResult'

import { playListMixin } from '../../common/util/mixin'

import { mapState, mapActions } from 'vuex'

export default {
  mixins: [playListMixin],
  data() {
    return {
      currentSelect: 0
    }
  },
  components: {
    ToggleButton,
    SongList,
    Scroll,
    NoResult
  },
  computed: {
    showNoResult() {
      if (this.currentSelect === 0 && (!this.collectList || !this.collectList.length)) {
        return true
      }
      if (this.currentSelect === 1 && (!this.playHistory || !this.playHistory.length)) {
        return true
      }
      return false
    },
    noResultInfo() {
      const info = this.currentSelect === 0 ? '没有一首歌合君胃口吗 ╯︿╰' : '快去听首歌吧 (*^_^*)'
      return info
    },
    ...mapState([
      'playHistory',
      'collectList'
    ])
  },
  methods: {
    randomPlay() {
      const list = this.currentSelect === 0
        ? this.collectList
        : this.playHistory
      if (!list || !list.length) {
        return
      }
      this.selectPlayAll({
        list
      })
    },
    playCollectSong(song, index) {
      this.selectPlay({
        list: this.collectList,
        index
      })
    },
    playRecentSong(song, index) {
      this.selectPlay({
        list: this.playHistory,
        index
      })
    },
    whenPlayList(playlist) {
      if (playlist) {
        this.$refs.collectScroll.$el.style.bottom = 60 + 'px'
        this.$refs.recentPlayScroll.$el.style.bottom = 60 + 'px'
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    selectBtn(index) {
      this.currentSelect = index
    },
    ...mapActions([
      'selectPlay',
      'selectPlayAll'
    ])
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';
.my-center {
  position fixed
  height 100%
  width 100%
  top 0
  left 0
  background rgb(250,250,250)
  z-index 1000
  color #2c3e50
  .top-wrapper {
    height 32px
    margin 10px 0 30px 0
    line-height 32px
    .back {
      position absolute
      font-size 22px
      padding-left 15px
      color $color-theme
    }
    .toggle-wrapper {
      font-size 14px
      flex-center()
    }
  }
  .btn {
    width 135px
    height 32px
    border-radius 16px
    margin 0 auto
    box-sizing border-box
    border 1px solid $color-text-l
    color $color-text-l
    flex-center()
    .icon {
      font-size 16px
      margin-right 7px
    }
    .text {
      font-size 12px
    }
  }
  .collect-wrapper {
    position fixed
    top 125px
    width 100%
    bottom 0
    overflow hidden
    .song-list {
      padding-top 0 !important
    }
  }
  .recent-play-wrapper {
    position fixed
    top 125px
    width 100%
    bottom 0
    overflow hidden
    .song-list {
      padding-top 0 !important
    }
  }
}

.slide-enter-active, .slide-leave-active {
  transition all .2s linear
}
.slide-enter, .slide-leave-to {
  transform translateX(100%)
}
</style>
