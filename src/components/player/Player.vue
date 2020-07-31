<template>
  <div class="player" v-show="playList.length">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-palyer" v-show="fullScreen">
        <div class="background-wrapper">
          <img :src="currentSong.image">
        </div>
        <!-- 标题栏 -->
        <div class="title-wrapper">
          <div class="title">
            <span @click="back" class="icon-wrapper"><i class="icon-back"></i></span>
            <span class="text">{{ currentSong.name }}</span>
          </div>
          <div class="singer">{{ currentSong.singer }}</div>
        </div>
        <!-- body -->
        <div class="player-body">
          <div class="record-box">
            <div class="record-wrapper" ref="normalCD">
              <img :src="currentSong.image" class="record" :class="recordCls">
            </div>
          </div>
        </div>
        <!-- 控制栏 -->
        <div class="control-wrapper">
          <!-- 切换歌词和唱片的按钮 -->
          <div class="dot-wrapper">
            <span class="dot active"></span>
            <span class="dot"></span>
          </div>
          <!-- //TODO:进度条  -->
          <div class="progress-wrapper">
            <span class="current-time">{{ currentTime }}</span>
            <div class="progress-bar"></div>
            <span class="time"></span>
          </div>
          <!-- 控制面板 -->
          <div class="control-panel">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" :class="disableCls" @click="prevOrNext()"></i>
            </div>
            <div class="icon i-center">
              <i @click="togglePlaying"
                 :class="playIcon + ' ' + disableCls"
              ></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" :class="disableCls" @click="prevOrNext(true)"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div @click="unfold" class="mini-player" v-show="!fullScreen">
        <div class="icon">
          <div class="img-wrapper">
            <img :src="currentSong.image" ref="miniCD" :class="recordCls">
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i @click.stop="togglePlaying" :class="miniPlayIcon"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio"
           :src="currentSong.url"
           @canplay="songReady = true"
           @error="onSongError"
           @timeupdate="setCurrentTime"
    ></audio>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import Util from '../../common/util'

const util = new Util()

const transform = util.prefixStyle('transform')

export default {
  data() {
    return {
      songReady: false,
      currentTime: 0
    }
  },
  computed: {
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniPlayIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    recordCls() {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    ...mapState([
      'fullScreen',
      'playList',
      'playing',
      'currentIndex'
    ]),
    ...mapGetters([
      'currentSong'
    ])
  },
  methods: {
    togglePlaying() {
      this.setPlaying(!this.playing)
    },
    back() {
      this.setFullScreen(false)
    },
    unfold() {
      this.setFullScreen(true)
    },
    prevOrNext(isNext) {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex
      if (!isNext) {
        index += -1
        if (index === -1) {
          index = this.playList.length - 1
        }
      } else {
        index += +1
        if (index === this.playList.length) {
          index = 0
        }
      }
      this.setCurrentIndex(index)
      this.songReady = false
    },
    onSongError() {
      this.songReady = true
      this.prevOrNext(true)
    },
    setCurrentTime(e) {
      this.currentTime = util.normalizeTime(e.target.currentTime)
    },
    // TODO: Plyer--methods
    enter(el, done) {
      const { x, y, scale } = this._getVariation()

      const animation = {
        0: {
          transform: `translate(${x}px, ${y}px) scale(${scale})`
        },
        60: {
          transform: 'translate(0, 0) scale(1.1)'
        },
        100: {
          transform: 'translate(0, 0) scale(1)'
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.normalCD, 'move', done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.normalCD.style.animation = ''
    },
    leave(el, done) {
      this.$refs.normalCD.style.transition = 'all .4s'
      const { x, y, scale } = this._getVariation()
      this.$refs.normalCD.style[transform] = `translate(${x}px, ${y}px) scale(${scale})`
      this.$refs.normalCD.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.normalCD.style.transition = ''
      this.$refs.normalCD.style[transform] = ''
    },
    _getVariation() {
      const miniCD = this.$refs.miniCD
      const normalCD = this.$refs.normalCD
      // miniCD中心与浏览器左(下)边框的距离
      const MINI_LEFT = 40
      const MINI_BOTTOM = 30
      // miniCD中心与浏览器左(下)边框的距离
      const NORMAL_LEFT = window.innerWidth / 2
      // css中将normalCD的宽度设为了浏览器宽度的80%
      const NORMAL_BOTTOM = window.innerHeight - (window.innerWidth * 0.8) / 2 - 85
      // 1. 获取mini播放器相对于播放界面之间的横轴偏移量
      const X = MINI_LEFT - NORMAL_LEFT
      // 2. 获取mini播放器相对于播放界面之间的纵轴偏移量
      const Y = NORMAL_BOTTOM - MINI_BOTTOM
      // 3. 获取mini播放器相对于播放界面的缩放比例
      const SCALE = miniCD.clientHeight / normalCD.clientHeight

      return {
        x: X,
        y: Y,
        scale: SCALE
      }
    },
    ...mapMutations([
      'setFullScreen',
      'setPlaying',
      'setCurrentIndex'
    ])
  },
  watch: {
    currentSong() {
      this.setPlaying(true)
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    },
    playing(currentPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        currentPlaying ? audio.play() : audio.pause()
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';
.player {
  .normal-palyer {
    position fixed
    width 100%
    top: 0
    bottom: 0
    background $color-background
    z-index 1000
    .background-wrapper {
      z-index -1
      img {
        position fixed
        width 100%
        height 100%
        filter blur(20px)
      }
    }
    .title-wrapper {
      position relative
      height 60px
      .title {
        display flex
        height 40px
        .icon-wrapper {
          flex 0 0 40px
          display flex
          justify-content flex-end
          align-items center
          font-size 22px
          color $color-theme
          i {
            transform rotate(-90deg)
          }
        }
        .text {
          flex 1
          text-align center
          line-height 40px
        }
        &:after {
          content ''
          display inline-block
          flex 0 0 40px
        }
      }
      .singer {
        height 20px
        line-height 20px
        text-align center
      }
    }
    .player-body {
      position absolute
      width 100%
      top 85px
      bottom 170px
      .record-box {
        position relative
        display flex
        justify-content center
        width 100%
        height 0
        padding-top 80%
        .record-wrapper {
          position absolute
          flex-center()
          top 0
          width 80%
          height 100%
          border-radius 50%
          background rgba(255, 255 , 255, .1)
          .record {
            height 94%
            border-radius 50%
            &.play {
              animation rotate 20s linear infinite
            }
            &.pause {
              animation-play-state paused
            }
          }
        }
      }
    }
    .control-wrapper {
      position absolute
      bottom 50px
      width 100%
      .dot-wrapper {
        display flex
        justify-content center
        .dot {
          display inline-block
          margin 0 4px
          width 8px
          height 8px
          background $color-text-l
          border-radius  4px
          &.active {
            width 20px
            background $color-text-ll
          }
        }
      }
      .progress-wrapper {
        height 50px
        box-sizing border-box
        padding 10px 0
        width 80%
        margin 0 auto
      }
      .control-panel {
        color $color-theme
        height 40px
        display flex
        .icon {
          flex 1
          &.i-left, &.i-right {
            display flex
            font-size 30px
            align-items center
          }
          &.i-left {
            justify-content flex-end
          }
          &.i-center {
            flex 1.6
            font-size 40px
            flex-center()
          }
          .disable {
            color $color-theme-d
          }
        }
      }
    }
    &.normal-enter-active, &.normal-leave-active{
      transition: all 0.4s
      .title-wrapper, .control-wrapper{
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      }
    }
    &.normal-enter, &.normal-leave-to{
      opacity: 0
      .title-wrapper{
        transform: translate3d(0, -100px, 0)
      }
      .control-wrapper{
        transform: translate3d(0, 100px, 0)
      }
    }
  }
  .mini-player {
    position fixed
    display flex
    align-items center
    width 100%
    height 60px
    background #333
    bottom 0
    z-index 1000
    .img-wrapper {
      float left
      padding 0 10px 0 20px
      img {
        width 40px
        height 40px
        border-radius 50%
        &.play {
          animation rotate 10s linear infinite
        }
        &.pause {
          animation-play-state paused
        }
      }
    }
    .text {
      width 205px
      .name {
        height 20px
        font-size 14px
        line-height 20px
      }
      .desc {
        margin-top 2px
        height 20px
        line-height 20px
        font-size 12px
        color $color-text-d
      }
    }
    .control {
      width 50px
      font-size 32px
      color $color-theme
      box-sizing border-box
      padding 0 10px
      &:last-child {
        font-size 28px
      }
    }
    &.mini-enter-active, &.mini-leave-active {
      transition all 0.4s
    }
    &.mini-enter, &.mini-leave-to {
      opacity 0
    }
  }
}

@keyframes rotate {
  from {
    transform rotate(0)
  }
  to {
    transform rotate(360deg)
  }
}
</style>
