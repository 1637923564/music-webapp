<template>
  <div class="toggle-button">
    <div class="btn"
         v-for="(item, index) in btnTitle"
         :key="index"
         :class="{ active: currentSelect === index }"
         @click="selectBtn(index)"
    >
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    btnTitle: {
      type: Array,
      required: true
    },
    currentSelect: {
      type: Number,
      default: 0
    }
  },
  methods: {
    selectBtn(index) {
      this.$emit('selectBtn', index)
    }
  }
}
</script>

<style lang="stylus" scoped>
.toggle-button {
  height 30px
  width 240px
  display flex
  border-radius 5px
  border 1px solid #333
  box-sizing border-box
  .btn {
    flex 1
    text-align center
    line-height 30px
    &.active {
      background #333
      color #fff
    }
  }
}

</style>
