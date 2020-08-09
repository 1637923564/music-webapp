<template>
  <transition name="slide">
    <div class="playlist" v-show="showPlaylist" @click="close">
      <div class="playlist-wrapper" @click.stop>
        <div class="top-wrapper">
          <span class="icon-left">
            <i :class="iconMode" @click="changeMode"></i>
          </span>
          <span class="text">{{ playStatus }}</span>
          <span class="icon-right">
            <i class="icon-clear" @click="showConfirm"></i>
          </span>
        </div>
        <scroll :tag="sequenceList" ref="scroll" class="list-wrapper">
          <transition-group name="list" tag="ul" class="list">
            <li class="song"
                v-for="(item, index) in sequenceList"
                :key="item.id"
                ref="song"
            >
              <span class="icon icon-left">
                <i class="icon-play" v-show="currentPlay(index)"></i>
              </span>
              <span class="song-name" @click="selectSong(item)">{{ item.name }}</span>
              <span class="icon icon-right">
                <i class="icon-not-favorite"></i>
                <i class="icon-delete" @click.stop="delPlaylist(index)"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="add-btn" @click="showAddSong">
          <i class="icon-add"></i>
          <span class="text">添加歌曲到队列</span>
        </div>
        <div class="close" @click="close">
          关闭
        </div>
      </div>
      <confirm title="是否清空播放列表？"
               confirmBtn="清空"
               cancelBtn="再想想"
               ref="confirm"
               @confirm="cleanAll"
      />
      <add-song ref="addSong" />
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import { playMode } from '../../common/config'
import { modeMixin } from '../../common/util/mixin'

import Scroll from '../../base/scroll/Scroll'
import Confirm from '../../base/confirm/Confirm'
import AddSong from '../../components/add-song/AddSong'

export default {
  mixins: [modeMixin],
  computed: {
    playStatus() {
      switch (this.mode) {
        case playMode.random:
          return '随机播放'
        case playMode.sequence:
          return '顺序播放'
        case playMode.loop:
          return '单曲循环'
      }
      return ''
    },
    ...mapState([
      'sequenceList',
      'showPlaylist',
      'mode',
      'sequenceList',
      'playList'
    ]),
    ...mapGetters([
      'currentSong'
    ])
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  methods: {
    showAddSong() {
      this.$refs.addSong.show()
    },
    cleanAll() {
      this.clearPlaylists()
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    selectSong(song) {
      const currentIndex = this.playList.findIndex(item => {
        return item.mid === song.mid
      })
      this.setCurrentIndex(currentIndex)
      this._scrollCurrent(300)
    },
    // 当前播放的歌曲
    currentPlay(index) {
      const currentIndex = this._currentPlay()
      if (currentIndex === index) {
        return true
      }
      return false
    },
    close() {
      this.setShowPlaylist(false)
    },
    _currentPlay() {
      const sequenceListIndex = this.sequenceList.findIndex(item => {
        return this.currentSong.mid === item.mid
      })
      return sequenceListIndex
    },
    _scrollCurrent(interval) {
      const sequenceListIndex = this._currentPlay()
      const el = this.$refs.song[sequenceListIndex]
      this.$refs.scroll.scrollToElement(el, interval)
    },
    ...mapMutations([
      'setShowPlaylist',
      'setMode',
      'setCurrentIndex',
      'setPlayList'
    ]),
    ...mapActions([
      'delPlaylist',
      'clearPlaylists'
    ])
  },
  watch: {
    showPlaylist(now) {
      if (now === true) {
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
          this._scrollCurrent()
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';
.playlist {
  z-index 10000
  position fixed
  bottom 0
  top 0
  width 100%
  background $color-background-e
  .playlist-wrapper {
    position absolute
    bottom 0
    background #333
    width 100%
    border-radius 40px 40px 0 0
    .top-wrapper {
      height 30px
      padding 20px 30px 10px 20px
      display flex
      .text {
        flex 1
        padding-left 10px
        font-size 14px
        line-height 30px
        color $color-text-ll
      }
      .icon-left {
        color $color-theme
        font-size 30px
      }
      .icon-right {
        color $color-text-l
        font-size 12px
        line-height 30px
        display inline-block
        width 32px
        text-align center
      }
    }
    .list-wrapper {
      max-height 240px
      overflow hidden
      width 100%
      .list {
        .song {
          display flex
          margin 0 30px 0 20px
          height 40px
          &.list-enter-active, &.list-leave-active{
            transition all .3s
          }
          &.list-enter, &.list-leave-to{
            height 0
            opacity 0
          }
          span {
            text-align center
            line-height 40px
            font-size 12px
            &.song-name {
              flex 1
              text-align left
              padding-left 10px
              color $color-text-l
              font-size 14px
            }
            &.icon {
              color $color-theme
            }
            &.icon-left {
              display inline-block
              width 14px
            }
            &.icon-right {
              width 64px
              display flex
              justify-content space-around
              align-items center
            }
          }
        }
      }
    }
    .add-btn {
      width 140px
      height 30px
      border 1px solid $color-text-l
      border-radius 15px
      line-height 30px
      text-align center
      font-size 12px
      margin 30px auto
      color $color-text-l
      box-sizing border-box
      .text {
        margin-left 10px
      }
    }
    .close {
      height 50px
      text-align center
      line-height 50px
      font-size 16px
      background #222
    }
  }
}

.slide-enter-active, .slide-leave-active {
  transition opacity .3s linear
  .playlist-wrapper {
    transition all .3s linear
  }
}
.slide-enter, .slide-leave-to {
  opacity 0
  .playlist-wrapper {
    transform translate(0, 100%)
  }
}
</style>
