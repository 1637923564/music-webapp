<template>
  <scroll :tag="result.length"
          class="search-result"
          ref="scroll"
          :listenScrollEnd="true"
          @onScrollToEnd="searchMore"
  >
    <div>
      <ul class="list" v-if="result.length">
        <li class="item"
            v-for="(item, index) in result"
            :key="index"
            @click="selectResult(item)"
        >
          <span class="icon">
            <i :class="setIcon(item)"></i>
          </span>
          <span class="text" v-html="setSongName(item)"></span>
        </li>
      </ul>
      <div class="bottom">
        <loading class="search-loading"
                 v-if="hasMore && !info"
                 loadingInfo=""
        />
        <div class="info" v-if="info">{{ info }}</div>
      </div>
    </div>
  </scroll>
</template>

<script>
import { search } from '../../api/search'
import { processUrl, isValidMusic, createSong } from '../../common/util/song'
import { ERR_OK } from '../../api/config'
import Singer from '../../common/util/singer'
import { mapMutations, mapActions, mapState } from 'vuex'
import { playListMixin } from '../../common/util/mixin'

import Scroll from '../../base/scroll/Scroll'
import Loading from '../../base/loading/Loading'

const PERPAGE = 20
const TYPE_SINGER = 'singer'

export default {
  mixins: [playListMixin],
  props: {
    query: {
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    },
    playCurrentSong: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      hasMore: true,
      info: ''
    }
  },
  components: {
    Scroll,
    Loading
  },
  computed: {
    ...mapState([
      'playList'
    ])
  },
  methods: {
    whenPlayList(playList) {
      const bottom = playList.length ? '60px' : ''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    search() {
      this.result = []
      this.page = 1
      this.hasMore = true
      this.info = ''
      this.$refs.scroll.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, PERPAGE)
        .then(res => {
          if (res.code === ERR_OK) {
            if (res.message === 'no results') {
              this.info = '木有更多啦 /(ㄒoㄒ)/~~'
              return
            }
            this._normalizeRes(res.data)
            this._hasMore(res.data.song)
          }
        })
    },
    searchMore() {
      this.scrollReady = false
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, PERPAGE)
        .then(res => {
          if (res.code === ERR_OK) {
            if (res.message === 'no results') {
              this.info = '没有了哟 ╮(╯▽╰)╭1'
              return
            }
            this.info = ''
            this._normalizeRes(res.data)
            this._hasMore(res.data.song)
          }
        })
    },
    setIcon(item) {
      return item.type === TYPE_SINGER ? 'icon-mine' : 'icon-music'
    },
    setSongName(item) {
      return item.type === TYPE_SINGER
        ? item.singername
        : item.name + ' - ' + item.singer
    },
    selectResult(item) {
      this.$emit('selectResult', item)
      if (item.type === TYPE_SINGER) {
        const singer = new Singer(item.singername, item.singermid)

        // 通过vuex设置singer属性
        this.setSinger(singer.addAvatar())
        this.$router.push({
          path: `/search/${item.singermid}`
        })
      } else {
        this.insertSong({
          song: item,
          playCurrentSong: this.playCurrentSong
        })
      }

      // 被点击的对象将被添加进入历史栏
      this._setHistory()
    },
    _setHistory() {
      this.saveSearchHistory(this.query)
    },
    _normalizeSong(song) {
      return song
    },
    _hasMore(song) {
      if (song.curpage * PERPAGE >= song.totalnum) {
        this.hasMore = false
        this.info = '找不到更多的了 /(ㄒoㄒ)/~~'
      } else {
        if (!this.$refs.scroll.scroll.hasVerticalScroll) {
          this.searchMore()
        }
      }
    },
    // TODO: normalizeSongs
    _normalizeRes(data, noSinger) {
      const ret = []
      if (!noSinger && data.zhida && data.zhida.singermid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      if (data.song && data.song.list) {
        const songs = data.song.list
        songs.forEach(item => {
          if (isValidMusic(item)) {
            ret.push(createSong(item))
          }
        })
      }
      let singer = null
      if (ret[0] && ret[0].type === TYPE_SINGER) {
        singer = ret.shift()
      }
      processUrl(ret).then(res => {
        const ret = []
        res.forEach(item => {
          if (item.url) {
            ret.push(item)
          }
        })
        if (this.result.length === 0 && singer) {
          ret.unshift(singer)
        }
        this.result = this.result.concat(ret)
      })
    },
    ...mapMutations(['setSinger']),
    ...mapActions(['insertSong', 'saveSearchHistory'])
  },
  watch: {
    query(newQuery) {
      this.search()
    }
  }
}
</script>

<style lang="stylus" scoped>
.search-result {
  position absolute
  top 0
  bottom 0
  width 100%
  box-sizing border-box
  padding 10px 30px 0 30px
  font-size 14px
  overflow hidden
  .list {
    .item {
      margin-bottom 20px
      height 16px
      line-height 16px
      display -webkit-box
      -webkit-box-orient vertical
      -webkit-line-clamp 1
      overflow hidden
      .icon {
        display inline-block
        width 30px
      }
    }
  }
  .bottom {
    padding-bottom 20px
    .info {
      font-size 16px
    }
  }
}
</style>
