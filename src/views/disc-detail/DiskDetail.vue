<template>
  <div class="disk-detail">
    <music-list :title="disk.dissname" :bgImg="disk.imgurl" :songs="songs" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import MusicList from '../../components/music-list/MusicList'
import { getSongList } from '../../api/recommend.js'
import { createSong, isValidMusic, processUrl } from '../../common/util/song'

export default {
  data() {
    return {
      songs: []
    }
  },
  components: {
    MusicList
  },
  computed: {
    ...mapState(['disk'])
  },
  created() {
    this._getDiskList()
  },
  methods: {
    _getDiskList() {
      if (!this.disk.dissid) {
        this.$router.push('/recommend')
        return
      }
      getSongList(this.disk.dissid)
        .then(res => {
          processUrl(this._normalizeSongs(res.cdlist[0].songlist))
            .then((songs) => {
              this.songs = songs
            })
        })
    },
    _normalizeSongs (list) {
      const ret = []
      list.forEach((musicData) => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  }
}
</script>

<style lang="stylus" scoped>
.disk-detail {
  position fixed
  top 0
  width 100%
  height 100%
  z-index 1000
  background $color-background
}
</style>
