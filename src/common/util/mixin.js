import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import { playMode } from '../../common/config'
import Util from '../util'

const util = new Util()

export const playListMixin = {
  computed: {
    ...mapState(['playList'])
  },
  mounted() {
    this.whenPlayList(this.playList)
  },
  activated() {
    this.whenPlayList(this.playList)
  },
  watch: {
    playList(newVal) {
      this.whenPlayList(newVal)
    }
  },
  methods: {
    whenPlayList() {
      throw new Error('componet must implement `whenPlayList` method')
    }
  }
}

export const modeMixin = {
  computed: {
    iconMode() {
      switch (this.mode) {
        case playMode.sequence:
          return 'icon-sequence'
        case playMode.loop:
          return 'icon-loop'
        case playMode.random:
          return 'icon-random'
      }
      return ''
    }
  },
  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setMode(mode)
      let list = null
      // 选择随机播放时
      if (mode === playMode.random) {
        list = util.randomSort(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      // 播放的歌曲索引也要同步更新为随机列表里的索引
      this._resetCurrentIndex(list)
      this.setPlayList(list)
    },
    _resetCurrentIndex(list) {
      const index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    }
  }
}

export const searchMixin = {
  data() {
    return {
      query: '',
      hotKey: []
    }
  },
  computed: {
    ...mapState([
      'searchHistory'
    ])
  },
  methods: {
    getQuery(query) {
      this.query = query
    },
    selectResult(item) {
      this.$refs.input.blur()
    },
    addQuery(val) {
      this.$refs.input.addVal(val)
    },
    ...mapActions([
      'removeHistory'
    ])
  }
}

export const collectMixin = {
  computed: {
    ...mapState(['collectList']),
    ...mapGetters(['currentSong'])
  },
  methods: {
    collectedStyle(song) {
      const index = this._getSameSong(song)
      if (index > -1) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    collect(song) {
      const index = this._getSameSong(song)
      if (index > -1) {
        this.removeCollect(index)
      } else {
        this.collectSong(song)
      }
    },
    _getSameSong(song) {
      const collectList = this.collectList || []
      const index = collectList.findIndex(item => {
        return item.id === song.id
      })
      return index
    },
    ...mapActions([
      'removeCollect',
      'collectSong'
    ])
  }
}

export const closePlayerByRouter = {
  computed: {
    ...mapState(['fullScreen'])
  },
  methods: {
    ...mapMutations(['setFullScreen'])
  },
  beforeRouteLeave (to, from, next) {
    if (this.fullScreen) {
      this.setFullScreen(false)
      next(false)
    } else {
      next()
    }
  }
}
