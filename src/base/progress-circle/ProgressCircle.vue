<template>
  <div class="progress-circle" @click.stop="togglePlaying">
    <slot></slot>
    <svg width="32"
         height="32"
         viewBox="0 0 100 100"
         version="1.1"
         xmlns="http://www.w3.org/2000/svg"
    >
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dasharray"
              :stroke-dashoffset="dashoffset"/>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  computed: {
    dasharray() {
      return Math.PI * 50 * 2
    },
    dashoffset() {
      return (1 - this.percent) * this.dasharray
    }
  },
  methods: {
    togglePlaying() {
      this.$emit('togglePlaying')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/variable"

.progress-circle{
  position: relative
  svg {
    position absolute
    z-index 1
    circle{
      stroke-width: 8px
      transform-origin: center
      &.progress-background{
        transform: scale(0.9)
        stroke: #907520ab
      }
      &.progress-bar{
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
      }
    }
  }

}
</style>
