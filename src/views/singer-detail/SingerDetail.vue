<template>
  <div class="singer-detail">
    <music-list :songs="songs" :title="singer.name" :bgImg="singer.avatar" />
  </div>
</template>

<script>
import MusicList from '../../components/music-list/MusicList'
import { mapState } from 'vuex'
import { createSong, isValidMusic, processUrl } from '../../common/util/song'
import { getSingerDetail } from '../../api/singer'
import { ERR_OK } from '../../api/config'
export default {
  data() {
    return {
      songs: []
    }
  },
  created() {
    this._getDetail()
  },
  computed: {
    ...mapState(['singer'])
  },
  components: {
    MusicList
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id)
        .then(res => {
          if (res.code === ERR_OK) {
            processUrl(this._normalizeSongs(res.data.list, res.data.singer_mid))
              .then(songs => {
                this.songs = songs
              })
          }
        })
    },
    // 将歌曲数据规范化
    _normalizeSongs(list, singerId) {
      const result = []
      list.forEach(item => {
        const { musicData } = item
        if (isValidMusic(musicData)) {
          result.push(createSong(musicData))
        }
      })
      return result
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';
.singer-detail {
  position fixed
  top 0
  width 100%
  height 100%
  z-index 1000
  color #2c3e50
}
</style>
