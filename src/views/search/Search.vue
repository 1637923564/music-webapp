<template>
  <div class="search" @click="searchInputBlur">
    <top-tip info="已删除搜索历史" ref="topTip" />
    <search-input ref="input" @getQuery="getQuery" />
    <scroll ref="scroll" class="shortcut" v-show="!query" :tag="tag">
      <div>
        <div class="hot-key" v-if="hotKey.length">
          <h1 class="title">热门搜索</h1>
          <ul class="hot-list">
            <li class="text"
                v-for="(item, index) in hotKey"
                :key="index"
                @click="addQuery(item.k)"
            >
              {{ item.k }}
            </li>
          </ul>
        </div>
        <div class="search-history" v-if="searchHistory && searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear">
              <i class="icon-clear" @click="showConfirm"></i>
            </span>
          </h1>
          <history-list :list="searchHistory"
                        @selectHistory="addQuery"
                        @removeOne="emptyHistory"
          />
        </div>
      </div>
    </scroll>
    <search-result @selectResult="selectResult" class="search-bar" v-show="query" :query="query" />
    <transition name="slide">
      <router-view />
    </transition>
    <confirm @confirm="emptyHistory"
             ref="confirm"
             title="是否清空搜索历史？"
             confirmBtn="清空"
             cancelBtn="再想想"
    />
  </div>
</template>

<script>
import { getHotKey } from '../../api/search'
import { ERR_OK } from '../../api/config'
import { playListMixin, searchMixin } from '../../common/util/mixin'

import SearchInput from '../../base/search-input/SearchInput'
import SearchResult from '../../components/search-result/SearchResult'
import Scroll from '../../base/scroll/Scroll'
import HistoryList from '../../base/history-list/HistoryList'
import Confirm from '../../base/confirm/Confirm'
import TopTip from '../../base/top-tip/TopTip'

export default {
  mixins: [playListMixin, searchMixin],
  components: {
    SearchInput,
    SearchResult,
    Scroll,
    HistoryList,
    Confirm,
    TopTip
  },
  computed: {
    tag() {
      return this.hotKey.concat(this.searchHistory)
    }
  },
  methods: {
    searchInputBlur() {
      this.$refs.input.blur()
    },
    emptyHistory(index) {
      this.$refs.topTip.show()
      // 确认清空搜索历史
      this.removeHistory(index)
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    whenPlayList(playList) {
      const bottom = playList.length ? '60px' : ''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$watch('query', (newQuery) => {
        if (newQuery === '') {
          this.$refs.scroll.refresh()
        }
      })
    },
    initBScorll() {
      this.$refs.scroll.refresh()
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 12)
        }
      })
    }
  },
  created() {
    this._getHotKey()
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';
.search {
  color #2c3e50
  .shortcut {
    position fixed
    top 168px
    bottom 0
    width 100%
    overflow hidden
    padding 0 20px
    box-sizing border-box
    .hot-key {
      font-size 14px
      .title {
        margin 20px 0
        font-weight bold
      }
      .hot-list {
        .text {
          display inline-block
          padding 5px 10px
          margin 0px 20px 10px 0
          border-radius 5px
          background #fff
          color #22d59c
          box-shadow 1px 1px 5px rgba(225, 225, 225, .5)
        }
      }
    }
    .search-history {
      margin-top 10px
      .title {
        position relative
        height 40px
        line-height 40px
        font-size 14px
        width 100%
        .text {
          font-weight bold
        }
        .clear {
          position absolute
          right 0
        }
      }
    }
  }
  .search-bar {
    position fixed
    top 168px
    bottom 0
    width 100%
  }
}
.slide-enter-active, .slide-leave-active {
  transition all .3s linear
}
.slide-enter, .slide-leave-to {
  transform translateX(100%)
}
</style>
