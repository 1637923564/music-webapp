<template>
  <div class="recommend">
    <scroll class="recommend-content" ref="scroll">
      <div>
        <!-- 轮播图 -->
        <div class="slider-wrapper" v-if="sliderData.length">
          <slider>
            <div v-for="(item, index) in sliderData" :key="index">
              <a :href="item.linkUrl"><img @load="!index && initBScroll()" :src="item.url"></a>
            </div>
          </slider>
        </div>
        <!-- 推荐歌单列表 -->
        <div class="recommend-list-wrapper">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul class="recommend-list" v-if="recommendListData[0]">
            <li class="recommend-item"
                v-for="(item, index) in recommendListData"
                :key="index"
                @click="selectDisc(item)"
            >
              <div class="img-wrapper">
                <img @load="!index && initBScroll()" v-lazy="item.imgurl">
              </div>
              <div class="text-wrapper">
                <h2 class="title">{{ item.dissname }}</h2>
                <span class="info">{{ item.creator.name }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-wrapper"
           v-show="!sliderData.length || !recommendListData.length">
        <loading />
      </div>
      <transition name="slide">
        <router-view />
      </transition>
    </scroll>
  </div>
</template>

<script>
import Slider from '../../base/slider/Slider'
import Scroll from '../../base/scroll/Scroll'
import Loading from '../../base/loading/Loading'
import { getTopBanner, getRecommendList } from '../../api/recommend'
import { ERR_OK } from '../../api/config'
import { playListMixin } from '../../common/util/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playListMixin],
  data() {
    return {
      sliderData: [],
      recommendListData: []
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  created() {
    this._getTopBanner()
    this._getRecommendList()
  },
  methods: {
    whenPlayList(playList) {
      const bottom = playList.length ? '60px' : ''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectDisc(disk) {
      this.$router.push({
        path: `/recommend/${disk.dissid}`
      })
      this.setDisk(disk)
    },
    // 获取轮播图相关数据
    _getTopBanner() {
      getTopBanner()
        .then(res => {
          if (res.code === ERR_OK) {
            this.sliderData = res.results
          }
        })
    },
    // 获取歌单列表相关数据
    _getRecommendList() {
      getRecommendList()
        .then(res => {
          if (res.code === ERR_OK) {
            this.recommendListData = res.data.list
          }
        })
    },
    // 事件：初始化better-scroll
    initBScroll() {
      this.$refs.scroll.refresh()
    },
    ...mapMutations(['setDisk'])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixin';
@import '../../common/stylus/variable';
.recommend
  .recommend-content
    position fixed
    width 100%
    top 88px
    bottom 0
    overflow: hidden
    .slider-wrapper
      position relative
      width 100%
      overflow hidden
    .recommend-list-wrapper
      .list-title
        height 65px
        flex-center()
        font-size 16px
        font-weight bold
        color #2c3e50
      .recommend-list
        .recommend-item
          display flex
          height 63px
          margin 0 20px 20px 20px
          border-radius 10px
          // border 1px solid #ccc
          // box-shadow 1px 1px 5px #eee
          .img-wrapper
            padding-right 20px
            img
              height 60px
              border-radius 10px
          .text-wrapper
            display flex
            flex-direction column
            justify-content space-around
            font-size 15px
            flex 1
            height 100%
            .title
              display -webkit-box
              -webkit-box-orient vertical
              -webkit-line-clamp 1
              overflow hidden
            .info
              color #999999
              font-size 13px
  .loading-wrapper
    position absolute
    top 0
    height 100%
    width 100%
    flex-center()

.slide-enter-active, .slide-leave-active {
  transition transform .3s linear
}
.slide-enter, .slide-leave-to {
  transform translate(100%, 0)
}
</style>
