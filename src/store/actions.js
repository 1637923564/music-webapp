export default {
  // 打开界面，并播放歌曲
  selectPlay({ commit, state }, { list, index }) {
    commit('setPlayList', list)
    commit('setSequenceList', list)
    commit('setCurrentIndex', index)
    commit('setFullScreen', true)
    commit('setPlaying', true)
  }
}
