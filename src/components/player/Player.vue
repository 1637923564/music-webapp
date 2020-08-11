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
          <div class="singer">
            <span @click="jumpSingerDetial">{{ currentSong.singer }}</span>
          </div>
        </div>
        <!-- body -->
        <div class="player-body"
             @touchstart="showLyricStart"
             @touchmove="showLyricMove"
             @touchend="showLyricEnd"
        >
          <!-- 唱片界面 -->
          <div class="record-box" ref="recordBox">
            <div class="record-wrapper" ref="normalCD">
              <img :src="currentSong.image" class="record" :class="recordCls">
            </div>
            <div class="record-lyric">{{ recordLyric }}</div>
          </div>
          <!-- 歌词界面 -->
          <scroll class="lyric-box" ref="lyricScroll" :tag="currentLyric">
            <div class="lyric-wrapper">
              <ul class="list" v-if="currentLyric">
                <li class="lyric"
                    ref="lyricLine"
                    :class="{active: index === lyricIndex}"
                    v-for="(item, index) in currentLyric.lines"
                    :key="index"
                >
                  {{ item.txt }}
                </li>
              </ul>
            </div>
          </scroll>
        </div>
        <!-- 控制栏 -->
        <div class="control-wrapper">
          <!-- 切换歌词和唱片的按钮 -->
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: !showLyric }"></span>
            <span class="dot" :class="{ active: showLyric }"></span>
          </div>
          <!-- 进度条  -->
          <div class="progress-wrapper">
            <span class="current-time">{{ normalizeTime }}</span>
            <div class="progress-bar">
              <progress-bar :percent="percent"
                            @changeProgress="changeProgress"
                            @updateTime="updateTime"
              />
            </div>
            <span class="time">{{ duration }}</span>
          </div>
          <!-- 控制面板 -->
          <div class="control-panel">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
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
              <i class="icon" :class="collectedStyle(currentSong)" @click="collect(currentSong)"></i>
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
          <progress-circle :percent="percent" @togglePlaying="togglePlaying">
            <i :class="miniPlayIcon"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist" @click.stop="showPlaylist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio"
           :src="currentSong.url"
           @canplay="ready"
           @error="onSongError"
           @timeupdate="setCurrentTime"
           @ended="automaticNext"
    ></audio>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import animations from 'create-keyframe-animation'
import { Base64 } from 'js-base64'
import LyricParser from 'lyric-parser'
import Util from '../../common/util'
import Singer from '../../common/util/singer'
import { playMode } from '../../common/config'
import { getLyric } from '../../api/song'
import { ERR_OK } from '../../api/config'
import { modeMixin, collectMixin } from '../../common/util/mixin'

import ProgressBar from '../../base/progress-bar/ProgressBar'
import ProgressCircle from '../../base/progress-circle/ProgressCircle'
import Scroll from '../../base/scroll/Scroll'

const util = new Util()

const transform = util.prefixStyle('transform')
const transition = util.prefixStyle('transition')

export default {
  mixins: [modeMixin, collectMixin],
  data() {
    return {
      songReady: false,
      currentTime: 0,
      normalizeTime: '00:00',
      timeStopChange: false,
      currentLyric: null,
      lyricIndex: 0,
      showLyric: false,
      recordLyric: ''
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
    duration() {
      return util.normalizeTime(this.currentSong.duration)
    },
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    ...mapState([
      'fullScreen',
      'playing',
      'currentIndex',
      'playList',
      'sequenceList',
      'mode',
      'singer'
    ])
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  },
  methods: {
    ready() {
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    showPlaylist() {
      this.setShowPlaylist(true)
    },
    togglePlaying() {
      this.setPlaying(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    back() {
      this.setFullScreen(false)
    },
    unfold() {
      this.setFullScreen(true)
    },
    automaticNext() {
      if (this.mode === playMode.loop) {
        this.loop()
        return
      }
      this.prevOrNext(true)
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.currentLyric.seek(0)
    },
    prevOrNext(isNext) {
      if (!this.songReady) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return
      }
      let index = this.currentIndex
      // 上一曲
      if (!isNext) {
        index += -1
        if (index === -1) {
          index = this.playList.length - 1
        }
      } else {
      // 下一曲
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
      if (!this.timeStopChange) {
        this.currentTime = e.target.currentTime
        this.normalizeTime = util.normalizeTime(this.currentTime)
      }
    },
    changeProgress(percent) {
      const time = this.currentSong.duration * percent
      this.$refs.audio.currentTime = time
      this.currentLyric.seek(time * 1000)
      if (!this.playing) {
        this.setPlaying(true)
      }
    },
    updateTime(percent) {
      if (percent >= 0) {
        this.timeStopChange = true
        const CURRENT_TIME = this.currentSong.duration * percent
        this.currentLyric.seek(CURRENT_TIME * 1000)
        this.normalizeTime = util.normalizeTime(CURRENT_TIME)
      } else {
        this.timeStopChange = false
      }
    },
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
    showLyricStart(e) {
      this.touch.init = 1
      this.touch.startX = e.touches[0].pageX
      this.touch.startY = e.touches[0].pageY
      this.touch.innerWidth = window.innerWidth
    },
    showLyricMove(e) {
      if (!this.touch.init) {
        return ''
      }
      this.touch.init = 2
      this.touch.moveX = e.touches[0].pageX - this.touch.startX
      this.touch.moveY = e.touches[0].pageY - this.touch.startY
      // 滑动的纵向距离大于横向距离时，不做任何处理
      if (Math.abs(this.touch.moveY) > Math.abs(this.touch.moveX)) {
        this.touch.init = 0
        return ''
      }

      const innerWidth = this.touch.innerWidth
      const left = this.showLyric ? -innerWidth : 0
      // 设置歌词页面偏移量在[0, -innerWidth]
      this.touch.offsetWidth = Math.min(Math.max(-innerWidth, left + this.touch.moveX), 0)
      this.touch.percent = Math.abs(this.touch.offsetWidth / innerWidth)
      this.$refs.lyricScroll.$el.style[transition] = ''
      this.$refs.lyricScroll.$el.style[transform] = `translateX(${this.touch.offsetWidth}px)`
    },
    showLyricEnd() {
      if (this.touch.init !== 2) {
        return
      }
      let offsetWidth = 1
      const innerWidth = this.touch.innerWidth
      const percent = this.touch.percent
      if (!this.showLyric) {
        if (percent > 0.15) {
          this.showLyric = true
          offsetWidth = -innerWidth
        } else {
          offsetWidth = 0
        }
      } else {
        if (percent < 0.85) {
          this.showLyric = false
          offsetWidth = 0
        } else {
          offsetWidth = -innerWidth
        }
      }
      this.$refs.lyricScroll.$el.style[transition] = 'transform 150ms linear'
      this.$refs.lyricScroll.$el.style[transform] = `translateX(${offsetWidth}px)`
      this.$refs.recordBox.style.opacity = 1 - Math.abs(offsetWidth / innerWidth)
      this.$refs.recordBox.style[transition] = 'opacity 100ms linear'

      this.touch.init = 0
    },
    jumpSingerDetial() {
      const id = this.currentSong.singer_mid
      const singer = this.currentSong.singer
      // 关闭播放器界面
      this.setFullScreen(false)
      if (id === this.singer.id) {
        return
      }

      const singerUtil = new Singer(singer, id)
      this.$router.push({
        path: `/singer/${id}`
      })
      this.setSinger(singerUtil.addAvatar())
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
    _getLyric() {
      getLyric(this.currentSong.mid)
        .then(res => {
          if (res.code === ERR_OK) {
            if (this.currentLyric) {
              this.lyricIndex = 0
              this.currentLyric.stop()
            }
            this.lyric = Base64.decode(res.lyric)
            this.currentLyric = new LyricParser(this.lyric, this._lyricHandler)
            if (this.playing) {
              this.currentLyric.play()
            }
          }
        })
        .catch(e => {
          this.currentLyric = null
          this.lyricIndex = 0
          this.recordLyric = ''
        })
    },
    _lyricHandler({ lineNum, txt }) {
      this.lyricIndex = lineNum
      if (lineNum > 5) {
        this.$refs.lyricScroll.scrollToElement(this.$refs.lyricLine[lineNum - 5], 1000)
      } else {
        this.$refs.lyricScroll.scrollTo(0, 0, 1000)
      }
      this.recordLyric = txt
    },
    ...mapMutations([
      'setFullScreen',
      'setPlaying',
      'setCurrentIndex',
      'setMode',
      'setPlayList',
      'setSinger',
      'setShowPlaylist'
    ]),
    ...mapActions([
      'savePlayHistory'
    ])
  },
  created() {
    this.touch = {}
  },
  watch: {
    // 播放的歌曲改变时，播放音乐
    currentSong(now, old) {
      if (now.id !== old.id && this.playList.length) {
        this.setPlaying(true)
        this.$nextTick(() => {
          this.$refs.audio.play()
        })

        // 获取歌词
        this._getLyric()
      }
    },
    playing(currentPlaying) {
      this.$nextTick(() => {
        const audio = this.$refs.audio
        currentPlaying ? audio.play() : audio.pause()
      })
    },
    fullScreen(now) {
      // 不显示播放器界面时，歌词界面偏移量设为0
      if (!now) {
        this.$refs.lyricScroll.$el.style[transform] = 'translateX(0px)'
        this.$refs.recordBox.style.opacity = 1
        // 表示是否显示歌词的标识符也设为false
        this.showLyric = false
      }
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
      text-shadow 2px 2px 9px rgba(0, 0, 0, .9)
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
          display -webkit-box
          -webkit-box-orient vertical
          -webkit-line-clamp 1
          overflow hidden
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
        display -webkit-box
        -webkit-box-orient vertical
        -webkit-line-clamp 1
        width 80%
        overflow hidden
        margin 0 auto
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
        .record-lyric {
          position absolute
          display block
          text-align center
          bottom -67px
          width 80%
          font-size $font-size-medium
          color $color-text-l
          line-height 20px
        }
      }
      .lyric-box {
        position absolute
        left 100%
        top 0
        width 100%
        height 100%
        line-height: 32px
        color: $color-text-l
        font-size: $font-size-medium
        text-align center
        overflow hidden
        .lyric-wrapper {
          width 80%
          margin 0 auto
          overflow hidden
          .lyric {
            &.active {
              color $color-text
              transition all 0.3s linear
              transform scale(1.1)
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
        display flex
        align-items center
        .current-time, .time {
          flex 0 0 30px
          font-size $font-size-small
        }
        .time {
          text-align right
        }
        .progress-bar {
          flex 1
        }
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
          &.i-right {
            position relative
            i {
              position absolute
              left 0
              &.icon-favorite {
                color red
              }
            }
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
        display -webkit-box
        -webkit-box-orient vertical
        -webkit-line-clamp 1
        overflow hidden
      }
      .desc {
        margin-top 2px
        height 20px
        line-height 20px
        font-size 12px
        color $color-text-d
        display -webkit-box
        -webkit-box-orient vertical
        -webkit-line-clamp 1
        overflow hidden
      }
    }
    .control {
      position relative
      width 50px
      height 32px
      font-size 32px
      color $color-theme
      box-sizing border-box
      padding 0 10px
      &:nth-child(3) i {
        position absolute
        top 0
      }
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
