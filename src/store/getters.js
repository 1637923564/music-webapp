export default {
  currentSong: state => state.playList[state.currentIndex] || {}
}
