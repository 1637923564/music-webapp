<template>
  <div class="singer">
    <list-view :data="singers" @selectSinger="selectSinger" />
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import ListView from '@/base/listView/listView.vue'
import { getSingers } from '../../api/singer'
const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'

export default {
  data() {
    return {
      singers: []
    }
  },
  components: {
    ListView
  },
  created() {
    this._getSingers()
  },
  methods: {
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    _getSingers() {
      getSingers()
        .then(res => {
          const nonstandard = res.data.list
          this._normalizeSingers(nonstandard)
        })
    },
    // 将后台获取的数据规范化
    _normalizeSingers(list) {
      const map = {
        hot: {
          title: HOT_NAME,
          list: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.list.push(this._spliceUrl({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            list: []
          }
          map[key].list.push(this._spliceUrl({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        } else {
          map[key].list.push(this._spliceUrl({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
      })
      // 将数据安照A-Z有序排列
      const hot = [map.hot]
      const nums = []
      const other = []
      for (const key in map) {
        const item = map[key]
        if (key.match(/[A-Z]/)) {
          other.push(item)
        } else if (key.match(/\d/)) {
          item.title = '#'
          nums.push(item)
        }
      }
      other.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      this.singers = hot.concat(other, nums)
    },
    // 拼接头像的url
    _spliceUrl({ id, name }) {
      return {
        id: id,
        name: name,
        avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
      }
    },
    ...mapMutations(['setSinger'])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.slide-enter-active, .slide-leave-active {
  transition all .3s
}
.slide-enter, .slide-leave-to {
  transform translate(100%, 0)
}
</style>
