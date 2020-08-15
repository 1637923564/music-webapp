<template>
  <div class="history-box">
    <transition-group name="list" tag="ul" class="list" v-if="list && list.length">
      <li class="history"
          v-for="(item, index) in list"
          :key="item"
          @click="selectHistory(item)"
      >
        <span class="text">{{ item }}</span>
        <span class="icon">
          <i class="icon-delete" @click.stop="removeOne(index)"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>

export default {
  props: {
    list: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  methods: {
    selectHistory(item) {
      this.$emit('selectHistory', item)
    },
    removeOne(index) {
      this.$emit('removeOne', index)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';
.history-box {
  color #2c3e50
  .list {
    .history {
      height 40px
      line-height 40px
      font-size 16px
      position relative
      &.list-enter-active, &.list-leave-active {
        transition all .3s linear
      }
      &.list-enter, &.list-leave-to {
        height 0
        opacity 0
      }
      .icon {
        font-size 12px
        position absolute
        right 0
      }
    }
  }
}
</style>
