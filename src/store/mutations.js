export default {
  setSinger(state, singer) {
    state.singer = singer
  },

  setPlaying(state, flag) {
    state.playing = flag
  },
  setFullScreen(state, flag) {
    state.fullScreen = flag
  },
  setPlayList(state, flag) {
    state.playList = flag
  },
  setSequenceList(state, flag) {
    state.sequenceList = flag
  },
  setMode(state, flag) {
    state.mode = flag
  },
  setCurrentIndex(state, flag) {
    state.currentIndex = flag
  }
}
