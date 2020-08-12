<template>
  <transition name="popup">
    <div class="confirm" v-show="isShow">
      <div class="confirm-wrapper" @click.stop>
        <div class="title">{{ title }}</div>
        <div class="control">
          <span class="confirm-btn" @click="confirm">{{ confirmBtn }}</span>
          <span class="cancel-btn" @click="cancel">{{ cancelBtn }}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    title: {
      default: '是否继续操作'
    },
    confirmBtn: {
      default: '确认'
    },
    cancelBtn: {
      default: '取消'
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    show() {
      this.isShow = true
    },
    hide() {
      this.isShow = false
    },
    confirm() {
      this.$emit('confirm')
      this.hide()
    },
    cancel() {
      this.hide()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';
.confirm {
  position fixed
  top 0
  bottom 0
  width 100%
  background $color-background-e
  font-size 18px
  flex-center()
  .confirm-wrapper {
    width 270px
    border-radius 20px
    background #fff
    .title {
      min-height 60px
      flex-center()
      padding 20px
      color #2c3e50
      box-sizing border-box
    }
    .control {
      height 43px
      border-top 1px solid #ddd
      color #777
      display flex
      .confirm-btn {
        flex 1
        border-right 1px solid #ddd
        flex-center()
      }
      .cancel-btn {
        flex 1
        flex-center()
      }
    }
  }
}

.popup-enter-active{
  animation: confirm-fadein 0.3s
  .confirm-wrapper{
    animation: confirm-zoom 0.3s
  }
}
@keyframes confirm-fadein{
  0%{
    opacity: 0
  }
  100%{
    opacity: 1
  }
}
@keyframes confirm-zoom{
  0%{
    transform: scale(0)
  }
  50%{
    transform: scale(1.1)
  }
  100%{
    transform: scale(1)
  }
}
</style>
