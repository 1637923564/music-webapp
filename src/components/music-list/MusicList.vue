<template>
  <div class="music-list">
    <div class="title-wrapper" ref="title">
      <div class="back" @click="back"><i class="icon-back"></i></div>
      <div class="title">{{ title }}</div>
    </div>
    <div class="background" :style="bgStyle" ref="bg">
      <div class="mask" ref="mask"></div>
      <div class="play-wrapper" v-show="songs.length">
        <div class="play-btn" @click="playAll">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll @scroll="scroll"
            :probeType="3"
            :listenScroll="true"
            class="song-scroll"
            ref="scroll"
            :tag="songs">
      <song-list @selectSong="selectSong" :songs="songs" :rank="rank" />
    </scroll>
  </div>
</template>

<script>
import SongList from '../../base/song-list/SongList'
import Scroll from '../../base/scroll/Scroll'
import Util from '../../common/util'
import { playListMixin } from '../../common/util/mixin'

import { mapActions } from 'vuex'

const util = new Util()

const transform = util.prefixStyle('transform')
const filter = util.prefixStyle('filter')

export default {
  mixins: [playListMixin],
  props: {
    bgImg: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0
    }
  },
  components: {
    SongList,
    Scroll
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImg})`
    }
  },
  mounted() {
    this._setStyle()
    this.minTranslate = -this.imageHeight + this.$refs.title.clientHeight
  },
  methods: {
    whenPlayList(playList) {
      const bottom = playList.length ? '60px' : ''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectSong(song, index) {
      this.selectPlay({ list: this.songs, index })
    },
    scroll(coor) {
      this.scrollY = coor.y
    },
    back() {
      this.$router.go(-1)
    },
    playAll() {
      this.selectPlayAll({ list: this.songs })
    },
    _setStyle() {
      this.imageHeight = this.$refs.bg.clientHeight
      this.$refs.scroll.$el.style.top = `${this.imageHeight}px`
      this.$refs.bgLayer.style.top = `${this.imageHeight}px`
    },
    ...mapActions(['selectPlay', 'selectPlayAll'])
  },
  watch: {
    // 拖动列表时，各个元素的样式变化
    scrollY(currentY) {
      let scale = 1
      let blur = 0
      const opacity = currentY / this.minTranslate
      const percent = Math.abs(currentY / this.imageHeight)

      // currentY > 0 : 向下拖动时
      if (currentY > 0) {
        scale += percent
        this.$refs.bg.style[transform] = `scale(${scale})`
      } else {
        blur = Math.min(25 * percent, 25)
        this.$refs.bg.style[filter] = `blur(${blur}px)`
      }

      // 0 < opacity <= 1 : 向上拉动，scroll(被拖动的盒子)滚动到顶部之前
      if (opacity >= 0.4 && opacity <= 1) {
        this.$refs.mask.style.background = `rgba(34, 34, 34, ${opacity})`
      }

      // currentY < this.minTranslate : 向上拖动，scroll已经超出了顶部
      if (currentY < this.minTranslate) {
        this.$refs.title.style.background = `rgba(34, 34, 34, ${opacity})`
      } else {
        this.$refs.title.style.background = null
      }
      const translate = Math.max(currentY, this.minTranslate)
      this.$refs.bgLayer.style[transform] = `translateY(${translate}px)`
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/variable"
@import "../../common/stylus/mixin"

.music-list {
  .title-wrapper {
    position absolute
    height 40px
    width 100%
    display flex
    font-size $font-size-large
    // background $color-background-e
    z-index 30
    .back {
      flex 0 0 45px
      flex-center()
      color $color-theme
      font-size 22px
    }
    .title {
      flex 1
      flex-center()
    }
    &:after {
      content ''
      flex 0 0 45px
    }
  }
  .background {
    position relative
    background-size cover
    padding-top 70%
    transform-origin: top
    height 0
    .mask {
      position absolute
      width 100%
      top 0
      bottom 0
      background $color-background-e
    }
    .play-wrapper {
      position absolute
      bottom 20px
      flex-center()
      color $color-theme
      width 100%
      .play-btn {
        width 135px
        height 32px
        border 1px solid $color-theme
        border-radius 32px
        flex-center()
        .icon-play {
          font-size $font-size-medium-x
        }
        .text {
          margin-left 5px
          font-size $font-size-small
        }
      }
    }
  }
  .bg-layer {
    position absolute
    background $color-background
    width 100%
    height 100%
  }
  .song-scroll {
    position absolute
    width 100%
    bottom 0
  }
}
</style>
