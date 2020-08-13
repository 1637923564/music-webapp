<template>
  <div class="list-view">
    <div class="loading-wrapper"
          v-show="!data.length"
    >
      <loading />
    </div>
    <scroll class="list-view-wrapper"
            ref="listView"
            :listenScroll="true"
            :probeType="3"
            @scroll="scroll"
    >
      <ul>
        <li class="singer-group"
            v-for="(group, i) in data"
            :key="i"
            ref="listGroup"
        >
          <h1 class="group-title"> {{ group.title }}</h1>
          <ul>
            <li class="singer"
                v-for="(item, j) in group.list"
                :key="j"
                @click="selectSinger(item)"
            >
              <img v-lazy="item.avatar" class="avatar">
              <span class="name">{{ item.name }} </span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="fixed-wrapper" v-if="(scrollY <= 0) && data[iIndex]" ref="fixed">
        <span class="fixed-title">{{ data[iIndex].title }}</span>
      </div>
    </scroll>
    <div class="singer-shortcut-wrapper">
      <ul class="shortcut-list"
          @touchstart.stop.prevent="controlPageJump"
          @touchmove.stop.prevent="controlPageJump"
      >
        <li class="shortcut"
            v-for="(item, index) in data"
            :key="index"
            :data-index="index"
            ref="shortcut"
            :class="{active: iIndex === index}"
        >
          {{ item.title.charAt(0) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Scroll from '../scroll/Scroll'
import Util from '../../common/util'
import Loading from '../loading/Loading'
import { playListMixin } from '../../common/util/mixin'

const util = new Util()

const touch = {}
const TITLE_HEIGHT = 30
let currentIndex = null
export default {
  mixins: [playListMixin],
  data() {
    return {
      iIndex: 0,
      scrollY: 0,
      diff: 0
    }
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  components: {
    Scroll,
    Loading
  },
  methods: {
    whenPlayList(playList) {
      const bottom = playList.length ? '60px' : ''
      this.$refs.listView.$el.style.bottom = bottom
      this.$refs.listView.refresh()
    },
    // 事件：控制页面跳转到想要的位置
    controlPageJump(e) {
      // 通过获取.singer-group的索引来达到滚动的目的
      if (e.type === 'touchstart') {
        // .singer-group的索引 = 被点击的元素的索引
        touch.y1 = e.touches[0].clientY
        currentIndex = util.attr(e.target, 'index')
        this.$refs.listView.scrollToElement(this.$refs.listGroup[currentIndex], 250)
      } else if (e.type === 'touchmove') {
        // .singer-group的索引 = (滑动到的位置 - 触摸时的位置) / 被点击元素的高度
        touch.y2 = e.touches[0].clientY
        const currentIndex1 = Math.floor(Number(currentIndex) + (touch.y2 - touch.y1) / this.$refs.shortcut[0].clientHeight)
        this.$refs.listView.scrollToElement(this.$refs.listGroup[currentIndex1], 0)
      }
    },
    // 事件：滚动时触发，设置右侧的快捷栏的高亮
    scroll(coor) {
      this.scrollY = coor.y
      const groupPosition = util.getElPosition(this.$refs.listGroup)
      const currentScrollInfo = util.getCurrentIndex(groupPosition, Math.abs(this.scrollY))
      this.iIndex = currentScrollInfo.result
      this.diff = currentScrollInfo.diffHeight
    },
    selectSinger(item) {
      this.$emit('selectSinger', item)
    }
  },
  watch: {
    diff(newDiff) {
      if (this.$refs.fixed) {
        if (newDiff <= 30) {
          this.$refs.fixed.style.top = newDiff - TITLE_HEIGHT + 'px'
        } else {
          this.$refs.fixed.style.top = 0
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';
.list-view
  .loading-wrapper
    position absolute
    top 0
    height 100%
    width 100%
    flex-center()
  .list-view-wrapper
    position fixed
    top 88px
    bottom 0
    width 100%
    overflow hidden
    color #2e3c50
    touch-action: none
    .fixed-wrapper
      position absolute
      top 0
      left 0
      height 30px
      font-size 14px
      padding-left 20px
      width 100%
      box-sizing border-box
      line-height 30px
      background rgb(243, 243, 243)
      box-shadow 1px 1px 5px #aaa
      .fixed-title {
        font-weight bold
        color #000
      }
    .singer-group
      padding-bottom 30px
      .group-title
        height 30px
        padding-left 20px
        line-height 30px
        font-size 14px
        background rgb(243, 243, 243)
        font-weight bold
        color #000
      ul
        .singer
          margin 20px 0 0 30px
          display flex
          align-items center
          border-radius 25px
          .avatar
            width 50px
            height 50px
            border-radius 12px
          .name
            margin-left 20px
            height 100%
            font-size 16px

  .singer-shortcut-wrapper
    position fixed
    top 88px
    right 0
    bottom 0px
    display flex
    align-items center
    font-size 12px
    color #fff
    .shortcut-list
      display flex
      padding 20px 0
      width 20px
      flex-direction column
      justify-content space-between
      align-items center
      background rgba(0, 0, 0, .2)
      border-radius 10px
      box-sizing border-box
      .shortcut
        flex-center()
        height 17px
        width 100%
        &.active
          color #22d59c
          font-weight bold
</style>
