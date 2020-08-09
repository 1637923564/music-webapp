<template>
  <div class="search-input">
    <div class="search-box">
      <span class="search">
        <i class="icon-search"></i>
      </span>
      <input type="text" :placeholder="placeholder" v-model="query">
      <span  class="clear" v-if="query">
        <i @click="clearVal" class="icon-dismiss"></i>
      </span>
    </div>
  </div>
</template>

<script>
import Util from '../../common/util'

const util = new Util()

export default {
  props: {
    placeholder: {
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: ''
    }
  },
  methods: {
    // 清空输入框
    clearVal() {
      this.query = ''
    },
    // 给内容框直接添加内容
    addVal(val) {
      this.query = val
    }
  },
  created() {
    this.$watch('query', util.throttle(newQuery => {
      this.$emit('getQuery', newQuery)
    }, 300))
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/mixin';

.search-input {
  width 100%
  .search-box {
    position relative
    margin 20px
    height 40px
    input {
      width 100%
      height 100%
      background #333
      border-radius 6px
      padding-left 40px
      box-sizing border-box
      border none
      outline medium
      color #ccc
      font-size 14px
    }
    .search, .clear {
      position absolute
      flex-center()
      width 40px
      height 100%
      top 0
      background #333
    }
    .search {
      font-size 24px
      color #999
    }
    .clear {
      font-size 16px
      right 0
      color #999
    }
  }
}
</style>
