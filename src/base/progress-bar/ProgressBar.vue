<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="progress" ref="progress"></div>
    <div class="progress-btn"
          ref="btn"
          @touchstart="dotTouchStart"
          @touchmove="dotTouchMove"
          @touchend="dotTouchEnd"
    >
      <div class="progress-btn-center"></div>
    </div>
  </div>
</template>

<script>
import Util from '../../common/util'
import { mapState } from 'vuex'

const util = new Util()

const transform = util.prefixStyle('transform')
const BUTTON_WIDTH = 16

export default {
  props: {
    percent: {
      type: Number,
      required: true
    }
  },
  created() {
    this.touch = {}
  },
  computed: {
    ...mapState(['fullScreen'])
  },
  methods: {
    dotTouchStart(e) {
      this.touch.init = true
      this.touch.touchX = e.touches[0].clientX
      this.touch.progressWidth = this.$refs.progress.clientWidth
    },
    dotTouchMove(e) {
      if (this.touch.init === true) {
        this.touch.currentX = e.touches[0].clientX
        // 手指移动的距离
        this.touch.moveX = this.touch.currentX - this.touch.touchX
        this.touch.resultX = Math.min(Math.max(0, this.touch.moveX + this.touch.progressWidth), this.$refs.progressBar.clientWidth - BUTTON_WIDTH)
        this._setProgress(this.touch.resultX)
      }
    },
    dotTouchEnd(e) {
      this.touch.init = false
      this._getPercent()
    },
    progressClick(e) {
      this._setProgress(e.offsetX)
      this._getPercent()
    },
    _setProgress(width) {
      this.$refs.progress.style.width = width + 'px'
      this.$refs.btn.style[transform] = `translateX(${width}px)`
    },
    _getPercent() {
      const percent = this.$refs.progress.clientWidth / (this.$refs.progressBar.clientWidth - BUTTON_WIDTH)
      this.$emit('changeProgress', percent)
    }
  },
  watch: {
    percent(current) {
      if (!this.touch.init) {
        const progressMaxWidth = this.$refs.progressBar.clientWidth - BUTTON_WIDTH
        const currentWidth = progressMaxWidth * current
        this._setProgress(currentWidth)
      }
    },
    fullScreen() {
      // 修复mini播放器暂停播放后,打开播放界面进度条为零的问题
      if (this.fullScreen) {
        const progressMaxWidth = this.$refs.progressBar.clientWidth - BUTTON_WIDTH
        const currentWidth = progressMaxWidth * this.percent
        this._setProgress(currentWidth)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';
.progress-bar {
  width 100%
  height 4px
  background $color-background-d
  position relative
  .progress {
    height 100%
    background $color-theme
    width 0
  }
  .progress-btn {
    position absolute
    top -6px
    left 0
    width 16px
    height 16px
    border-radius 50%
    background #fff
    flex-center()
    .progress-btn-center {
      width 50%
      height 50%
      background $color-theme
      border-radius 50%
    }
  }
}
</style>
