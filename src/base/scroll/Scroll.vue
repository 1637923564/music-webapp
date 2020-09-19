<template>
  <div class="scroll" ref="scroll" @touchstart="toRefresh">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    tag: {
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    listenScrollEnd: {
      type: Boolean,
      default: false
    },
    scrollReady: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    this._initScroll()
  },
  methods: {
    toRefresh() {
      this.refresh()
    },
    // 初始化better-scroll
    _initScroll() {
      this.scroll = new BScroll(this.$refs.scroll, {
        probeType: this.probeType,
        click: this.click,
        scrollY: true
      })

      if (this.listenScroll) {
        // 监听滚动
        this.scroll.on('scroll', coor => {
          this.$emit('scroll', coor)
        })
      }

      if (this.listenScrollEnd) {
        // 每次滚动结束
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            this.$emit('onScrollToEnd')
          }
        })
      }
    },
    // 重新初始化better-scroll
    refresh() {
      this.scroll.refresh()
    },
    // 滚动到某个位置
    scrollToElement(el, time) {
      this.scroll.scrollToElement(el, time)
    },
    scrollTo(x, y, time) {
      this.scroll.scrollTo(x, y, time)
    }
  },
  watch: {
    tag() {
      this.$nextTick(() => {
        this.refresh()
      })
    }
  }
}
</script>
<style lang="stylus">
</style>
