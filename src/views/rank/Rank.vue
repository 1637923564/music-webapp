<template>
  <div class="rank">
    <scroll class="scroll-box" :tag="topList" ref="scroll">
      <div class="rank-wrapper">
        <ul class="list" v-if="topList.length">
          <li class="rank"
              v-for="(top, index) in topList"
              :key="index"
              @click="openRankDetail(top)"
          >
            <!-- 图片 -->
            <div class="image"><img v-lazy="top.picUrl"></div>
            <!-- 内容 -->
            <div class="detail">
              <span class="text" v-for="(info, j) in top.songList" :key="j">
                {{ j + 1 }}. {{ info.singername }} - {{ info.songname }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </scroll>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
// import { mapState } from 'vuex'

import { getTopList } from '../../api/rank'
import { ERR_OK } from '../../api/config'
import { playListMixin } from '../../common/util/mixin'

import Scroll from '../../base/scroll/Scroll'
import { mapMutations } from 'vuex'

export default {
  mixins: [playListMixin],
  data() {
    return {
      topList: []
    }
  },
  components: {
    Scroll
  },
  created() {
    this._getTopList()
  },
  methods: {
    openRankDetail(top) {
      this.$router.push({
        path: `/rank/${top.id}`
      })
      this.setRank(top)
    },
    // 打开mini播放器的时候，该界面的bottom为60px
    whenPlayList(playList) {
      if (playList.length) {
        const bottom = 60 + 'px'
        this.$refs.scroll.$el.style.bottom = bottom
        this.$refs.scroll.refresh()
      }
    },
    _getTopList() {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    },
    ...mapMutations(['setRank'])
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';
.scroll-box {
  width 100%
  position fixed
  top 88px
  bottom 0
  overflow hidden
  .rank-wrapper {
    .list {
      .rank {
        margin 20px 20px 0 20px
        height 100px
        display flex
        background #333
        border-radius 10px
        .image {
          flex 0 0 100px
          img {
            width 100px
            height 100px
          }
        }
        .detail {
          flex 1
          height 100%
          display flex
          flex-direction column
          justify-content center
          .text {
            display -webkit-box
            -webkit-box-orient vertical
            -webkit-line-clamp 1
            overflow hidden
            height 26px
            padding 0 20px
            font-size $font-size-small
            line-height 26px
            color $color-text-d
          }
        }
      }
    }
  }
}
.slide-enter-active, .slide-leave-active {
  transition all .3s
}
.slide-enter, .slide-leave-to {
  transform translate(100%, 0)
}
</style>
