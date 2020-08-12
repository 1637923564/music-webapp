<template>
  <transition name="trans">
    <div class="top-tip" ref="topTip" v-show="isShow">
      <span class="icon">
        <i class="icon-ok"></i>
      </span>
      <span class="text">
        {{ info }}
      </span>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    info: {
      type: String,
      default: '成功'
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    show() {
      clearTimeout(this.timer1)
      clearTimeout(this.timer2)
      this.isShow = false
      this.timer1 = setTimeout(() => {
        this.isShow = true
        this.timer2 = setTimeout(() => {
          this.isShow = false
        }, 1500)
      }, 200)
    },
    hide() {
      this.isShow = false
    },
    _setLeft() {
      const bodyWidth = window.innerWidth
      const tipWidth = 230
      const left = bodyWidth / 2 - tipWidth / 2
      this.$refs.topTip.style.left = left + 'px'
    }
  },
  mounted() {
    this._setLeft()
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/mixin';
.top-tip {
  position fixed
  top 25px
  background-color #fff
  border-radius 3px
  padding 7px 0
  width 210px
  color rgb(152,195,121)
  font-weight bold
  box-shadow 1px 1px 3px #aaa
  flex-center()
  .icon {
    font-weight bold
    margin-right 15px
  }
  .text {
    font-size 16px
  }
}

.trans-enter-active {
  transition all .3s linear
}
.trans-leave-active {
  transition all .2s linear
}
.trans-enter, .trans-leave-to {
  transform translateY(-55px)
  opacity 0
}
</style>
