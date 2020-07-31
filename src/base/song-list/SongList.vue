<template>
  <div class="song-list">
    <ul class="list" v-if="songs.length">
      <li class="song"
          v-for="(item, index) in songs"
          :key="index"
          @click="selectSong(item, index)"
      >
        <span class="title">{{ item.name }}</span>
        <span class="decription">{{ item.singer + ' - ' + item.album }}</span>
      </li>
    </ul>
    <div class="loading-wrapper" v-show="!songs.length">
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
    }
  },
  components: {
    Loading
  },
  methods: {
    selectSong(song, index) {
      this.$emit('selectSong', song, index)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';
.song-list {
  position relative
  .list {
    padding 20px 30px
    .song {
      height 64px
      display flex
      flex-direction column
      font-size $font-size-medium
      span {
        margin 5px 0
        &.decription {
          color $color-text-d
          display -webkit-box
          -webkit-box-orient vertical
          -webkit-line-clamp 1
          overflow hidden
          width 90%
        }
      }
    }
  }
  .loading-wrapper{
    position fixed
    top 263px
    bottom 0
    width 100%
    flex-center()
  }
}
</style>
