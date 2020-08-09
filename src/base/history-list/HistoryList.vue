<template>
  <div class="history-box">
    <ul class="list" v-if="list.length">
      <li class="history"
          v-for="(item, index) in list"
          :key="index"
          @click="selectHistory(item)"
      >
        <span class="text">{{ item }}</span>
        <span class="icon">
          <i class="icon-delete" @click.stop="removeOne(index)"></i>
        </span>
      </li>
    </ul>
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
  color $color-text-l
  .list {
    .history {
      height 40px
      line-height 40px
      font-size 16px
      position relative
      .icon {
        font-size 12px
        position absolute
        right 0
      }
    }
  }
}
</style>
