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
import { filterSinger, processUrl } from '../../common/util/song'
import { ERR_OK } from '../../api/config'
import Singer from '../../common/util/singer'
import { mapMutations, mapActions, mapState } from 'vuex'
import { playListMixin } from '../../common/util/mixin'
import Storage from '../../common/util/cache'
import { storageKey } from '../../common/config'

import Scroll from '../../base/scroll/Scroll'
import Loading from '../../base/loading/Loading'

const storage = new Storage()

const PERPAGE = 20
const TYPE_SINGER = 'singer'
const NO_SINGER = true
const STORAGE_SEARCH = storageKey.search

export default {
  mixins: [playListMixin],
  props: {
    query: {
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
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
            this.result = this._normalizeRes(res.data)
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
            this.result = this.result.concat(this._normalizeRes(res.data, NO_SINGER))
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
        : item.songname + ' - ' + filterSinger(item.singer)
    },
    selectResult(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer(item.singername, item.singermid)

        // 通过vuex设置singer属性
        this.setSinger(singer.addAvatar())
        this.$router.push({
          path: `/search/${item.singermid}`
        })
      } else {
        // processUrl这个方法只能处理一个数组
        const arr = []
        arr.push(this._normalizeSong(item))
        // 为歌曲信息添加歌曲播放地址
        processUrl(arr).then(res => {
          const song = res[0]
          this.insertSong(song)
        })
      }

      // 被点击的对象将被添加进入历史栏
      this._setHistory()
    },
    _setHistory() {
      const arr = []
      arr.push(this.query)
      if (!storage.val(STORAGE_SEARCH)) {
        storage.val(STORAGE_SEARCH, arr)
      }
      this.saveSearchHistory(this.query)
    },
    _normalizeSong(song) {
      return {
        id: song.songid,
        mid: song.songmid,
        singer: filterSinger(song.singer),
        name: song.songname,
        album: song.albumname,
        duration: song.interval,
        singerMid: song.singer[0].mid,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.albummid}.jpg?max_age=2592000`,
        url: song.url
      }
    },
    _hasMore(song) {
      if (song.curpage * PERPAGE >= song.totalnum) {
        this.hasMore = false
        this.info = '找不到更多的了 /(ㄒoㄒ)/~~'
      }
    },
    _normalizeRes(data, noSinger) {
      let ret = []
      if (!noSinger && data.zhida && data.zhida.singermid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      if (data.song && data.song.list) {
        ret = ret.concat(data.song.list)
      }
      return ret
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
