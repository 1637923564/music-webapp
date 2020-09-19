<template>
  <div class="app">
    <m-header />
    <tab />
    <transition name="router-fade">
      <keep-alive>
        <router-view />
      </keep-alive>
    </transition>
    <player></player>
    <playlist />
  </div>
</template>

<script>
import MHeader from './components/m-header/MHeader'
import Tab from './components/tab/Tab'
import Player from './components/player/Player'
import Playlist from './components/playlist/Playlist'

export default {
  components: {
    MHeader,
    Tab,
    Player,
    Playlist
  },
  mounted() {
    window.onresize = () => {
      setTimeout(() => {
        window.location.reload()
      }, 100)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.router-fade-enter-active, .router-fade-leave-active {
  transition all .2s ease
}
.router-fade-enter, .router-fade-leave-to {
  opacity 0
}
</style>
