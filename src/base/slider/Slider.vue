<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots-wrapper" v-if="dots.length">
      <span class="dot"
            v-for="(item, index) in dots"
            :key="index"
            :class="index === currentIndex ? 'active' : ''"></span>
    </div>
  </div>
</template>

<script>
import Util from '../../common/util'
import BScroll from 'better-scroll'

const util = new Util()
export default {
  data() {
    return {
      currentIndex: 0,
      dots: []
    }
  },
  props: {
    loop: { // 是否循环轮播
      type: Boolean,
      default: true
    },
    autoPlay: { // 是否自动轮播
      type: Boolean,
      default: true
    },
    interval: { // 轮播间隔
      type: Number,
      default: 5000
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._setSliderWidth()
      this._initSlider()
      this._initDots()
      if (this.autoPlay) {
        this._play()
      }
      window.addEventListener('resize', () => {
        if (this.slider) {
          this._setSliderWidth(true)
          this.slider.refresh()
        }
      })
    })
  },
  methods: {
    // 设置轮播图的宽度
    _setSliderWidth(isOnResize) {
      const elSliderGroup = this.$refs.sliderGroup
      this.elSliderItemList = elSliderGroup.children
      const elSliderItemList = this.elSliderItemList
      const sliderWidth = this.$refs.slider.clientWidth
      let sliderGroupWidth = 0
      // 为sliderGroup节点中的每个div添加一个类名：slider-item
      // 让.slider-item元素的宽度等于.slider的宽度
      for (let i = 0; i < elSliderItemList.length; i++) {
        const child = elSliderItemList[i]
        util.addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        sliderGroupWidth += sliderWidth
      }
      // BScroll内部实现循环轮播时，会克隆两个slider-item
      // 更改窗口大小时，初始化轮播图已经被初始化，也就是slider-item已经被克隆
      if (this.loop && !isOnResize) { sliderGroupWidth += 2 * sliderWidth }
      elSliderGroup.style.width = sliderGroupWidth + 'px'
    },
    // 初始化轮播图
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        click: true,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })
      this.slider.on('scrollEnd', () => {
        // 获取轮播图当前所在位置
        const pageIndex = this.slider.getCurrentPage().pageX
        this.currentIndex = pageIndex
        // 手拖动轮播图时，暂停自动轮播
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    // 设置dot的个数
    _initDots() {
      // BScroll内部克隆了两张图片，需要减2
      this.dots = new Array(this.elSliderItemList.length - 2)
    },
    // 自动轮播
    _play() {
      let nextIndex
      this.timer = setInterval(() => {
        nextIndex = this.currentIndex + 1
        // nextIndex = nextIndex === 7 ? 0 : nextIndex
        this.slider.goToPage(nextIndex, 0, 400)
      }, this.interval)
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="stylus"  rel="stylesheet/stylus" scoped>
@import '../../common/stylus/variable';
  .slider
    min-height 1px
    overflow hidden
    .slider-group
      overflow hidden
      .slider-item
        float: left
        a
          display: block
          width: 100%
          img
            display block
            width 100%
    .dots-wrapper
      position absolute
      height 8px
      bottom 12px
      width 100%
      text-align center
      .dot
        display inline-block
        width 8px
        height 8px
        border-radius 50%
        background-color $color-text-ll
        margin 0 4px
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
