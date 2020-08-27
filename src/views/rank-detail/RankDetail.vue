<template>
  <div class="rank-detail">
    <music-list :title="rank.topTitle" :bgImg="rank.picUrl" :songs="songs" :rank="true" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getMusicList } from '../../api/rank'
import { isValidMusic, createSong, processUrl } from '../../common/util/song'

import MusicList from '../../components/music-list/MusicList'
import { ERR_OK } from '../../api/config'
import { closePlayerByRouter } from '../../common/util/mixin'

export default {
  mixins: [closePlayerByRouter],
  data() {
    return {
      songs: []
    }
  },
  components: {
    MusicList
  },
  computed: {
    ...mapState(['rank'])
  },
  created() {
    this._getMusicList()
  },
  methods: {
    _getMusicList() {
      if (!this.rank.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.rank.id)
        .then(res => {
          if (res.code === ERR_OK) {
            processUrl(this._normalizeSongs(res.songlist))
              .then(res => {
                this.songs = res
              })
          }
        })
    },
    _normalizeSongs(list) {
      const ret = []
      list.forEach(item => {
        const musicData = item.data
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
.rank-detail {
  position fixed
  top 0
  bottom 0
  width 100%
}
</style>
