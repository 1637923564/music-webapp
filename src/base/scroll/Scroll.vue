<template>
  <div class="scroll" ref="scroll">
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
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this._initScroll()
  },
  methods: {
    // 初始化better-scroll
    _initScroll() {
      this.scroll = new BScroll(this.$refs.scroll, {
        probeType: this.probeType,
        click: this.click,
        scrollY: true
      })
      if (this.listenScroll) {
        this.scroll.on('scroll', coor => {
          this.$emit('scroll', coor)
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
    }
  },
  watch: {
    tag() {
      this.refresh()
    }
  }
}
</script>
