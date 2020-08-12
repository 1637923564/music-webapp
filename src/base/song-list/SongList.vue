<template>
  <div class="song-list">
    <ul class="list" v-if="songs && songs.length">
      <li class="song"
          v-for="(item, index) in songs"
          :key="index"
          @click="selectSong(item, index)"
      >
        <div class="icon-wrapper" v-if="rank">
          <span :class="computedIcon(index)" v-text="computedText(index)"></span>
        </div>
        <div class="info">
          <span class="title">{{ item.name }}</span>
          <span class="decription">{{ item.singer + ' - ' + item.album }}</span>
        </div>
      </li>
    </ul>
    <div class="loading-wrapper" v-show="!songs || !songs.length">
      <loading/>
    </div>
  </div>
</template>

<script>
import Loading from '../loading/Loading'
export default {
  props: {
    songs: {
      type: Array,
      default: () => {
        return []
      }
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    icon(index) {
      return this.computedIcon(index)
    }
  },
  components: {
    Loading
  },
  methods: {
    selectSong(song, index) {
      this.$emit('selectSong', song, index)
    },
    computedIcon(index) {
      if (index < 3) {
        return 'icon icon' + index
      } else {
        return 'text'
      }
    },
    computedText(index) {
      if (index > 2) {
        return index + 1
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';
.song-list {
  background rgba(250,250,250,1)
  padding 20px 30px
  .list {
    .song {
      display flex
      height 64px
      font-size $font-size-medium
      .icon-wrapper {
        position relative
        flex 0 0 55px
        .icon {
          display block
          width 25px
          height 25px
          background-size contain
          position absolute
          top 10px
          &.icon0 {
            bg-img('0')
          }
          &.icon1 {
            bg-img('1')
          }
          &.icon2 {
            bg-img('2')
          }
        }
        .text {
          position absolute
          font-size 18px
          color #2c3e50
          top 15px
          left 5px
        }
      }
      .info {
        flex 1
        display flex
        flex-direction column
        height 100%
        span {
          margin 5px 0
          &.title {
            display -webkit-box
            -webkit-box-orient vertical
            -webkit-line-clamp 1
            overflow hidden
            font-size 16px
          }
          &.decription {
            color #aaa
            display -webkit-box
            -webkit-box-orient vertical
            -webkit-line-clamp 1
            overflow hidden
            width 90%
          }
        }
      }
    }
  }
  .loading-wrapper{
    position absolute
    top 0
    bottom 0
    left 0
    width 100%
    flex-center()
  }
}
</style>
