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
    <top-tip info="已删除搜索历史" ref="topTip" />
  </div>
</template>

<script>
import TopTip from '../../base/top-tip/TopTip'

export default {
  props: {
    list: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  components: {
    TopTip
  },
  methods: {
    selectHistory(item) {
      this.$emit('selectHistory', item)
    },
    removeOne(index) {
      this.$refs.topTip.show()
      this.$emit('removeOne', index)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';
.history-box {
  color $color-text-l
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
