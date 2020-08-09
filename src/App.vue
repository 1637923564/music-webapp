<template>
  <div class="app">
    <m-header />
    <tab />
    <keep-alive>
      <router-view />
    </keep-alive>
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
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
