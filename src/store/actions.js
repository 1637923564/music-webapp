import { playMode, storageKey } from '../common/config'
import Util from '../common/util'
import Storage from '../common/util/cache'

const storage = new Storage()
const util = new Util()
const STORAGE_SEARCH = storageKey.search
const SEARCH_MAX_LENGTH = 15 // 搜索记录的最大长度
const STORAGE_PLAY = storageKey.play
const PLAY_MAX_LENGTH = 200

function findIndex(list, item) {
  return list.findIndex(val => {
    return val.id === item.id
  })
}

export default {
  // 打开界面，并播放歌曲
  selectPlay({ commit, state }, { list, index }) {
    if (state.mode === playMode.random) {
      // 修复随机播放时在歌曲列表选择歌曲会更改为顺序播放的问题
      let randomList = state.playList
      // 随机播放时清空列表再点击歌曲时，randomList 为空数组
      if (!randomList.length) {
        randomList = util.randomSort(list)
      }
      commit('setPlayList', randomList)
      // 修复随机播放时在歌曲列表界面点击歌曲不能播放对应歌曲的问题
      commit('setCurrentIndex', findIndex(randomList, list[index]))
    } else {
      commit('setPlayList', list)
      commit('setCurrentIndex', index)
    }
    commit('setSequenceList', list)

    commit('setFullScreen', true)
    commit('setPlaying', true)
  },

  // 随机播放全部歌曲
  selectPlayAll({ commit, state }, { list }) {
    commit('setMode', playMode.random)

    const randomList = util.randomSort(list)
    commit('setPlayList', randomList)
    commit('setSequenceList', list)
    commit('setCurrentIndex', 0)
    commit('setFullScreen', true)
    commit('setPlaying', true)
  },

  // 将歌曲插入到播放列表
  insertSong({ commit, state }, song) {
    // 深拷贝，防止修改原数组
    const [...playList] = state.playList
    const [...sequenceList] = state.sequenceList
    let currentIndex = state.currentIndex
    const currentSong = playList[currentIndex] // undefined

    // 获取播放列表中与插入歌曲相同的歌曲索引
    const index = findIndex(playList, song) // -1

    if (playList.length || currentIndex === -1) {
      currentIndex++
    }
    playList.splice(currentIndex, 0, song)
    // 删除播放列表中与插入歌曲相同的歌曲
    if (index > -1) {
      if (index < currentIndex) {
        playList.splice(index, 1)
        currentIndex--
      } else if (index >= currentIndex) {
        playList.splice(index + 1, 1)
      }
    }
    // 将歌曲插入到sequenceList
    let currentSIndex = findIndex(sequenceList, currentSong)
    const sIndex = findIndex(sequenceList, song)
    if (sequenceList.length || currentIndex === -1) {
      currentSIndex++
    }
    sequenceList.splice(currentSIndex, 0, song)

    if (sIndex > -1) {
      if (sIndex < currentSIndex) {
        sequenceList.splice(sIndex, 1)
      } else {
        sequenceList.splice(sIndex + 1, 1)
      }
    }

    commit('setPlayList', playList)
    commit('setSequenceList', sequenceList)
    commit('setCurrentIndex', currentIndex)
    commit('setPlaying', true)
    commit('setFullScreen', true)
  },

  // 存储搜索历史到本地
  saveSearchHistory({ commit, state }, val) {
    commit('setSearchHistory', storage.insert({
      key: STORAGE_SEARCH,
      val,
      maxLen: SEARCH_MAX_LENGTH
    }))
  },

  // 删除历史记录
  removeHistory({ commit, state }, index) {
    const history = storage.remove(STORAGE_SEARCH, index)
    commit('setSearchHistory', history)
  },

  // 删除播放列表中的歌曲
  delPlaylist({ commit, state }, index) {
    // 深拷贝，防止修改原数组
    const [...sequenceList] = state.sequenceList
    const [...playlist] = state.playList
    let currentIndex = state.currentIndex
    const tar = sequenceList[index]
    const pIndex = playlist.findIndex(item => {
      return tar.mid === item.mid
    })

    sequenceList.splice(index, 1)
    playlist.splice(pIndex, 1)

    if (pIndex < currentIndex) {
      currentIndex--
    }

    commit('setPlayList', playlist)
    commit('setSequenceList', sequenceList)
    commit('setCurrentIndex', currentIndex)

    if (!playlist.length) {
      commit('setPlaying', false)
      commit('setShowPlaylist', false)
    }
  },

  // 清空播放列表
  clearPlaylists({ commit, state }) {
    commit('setPlaying', false)
    commit('setPlayList', [])
    commit('setSequenceList', [])
    commit('setCurrentIndex', -1)
    commit('setShowPlaylist', false)
  },

  // 存储播放历史到本地数据
  savePlayHistory({ commit, state }, song) {
    // 由于song的元素是对象，所以需要传一个target
    commit('setPlayHistory', storage.insert({
      key: STORAGE_PLAY,
      val: song,
      maxLen: PLAY_MAX_LENGTH,
      target: 'id'
    }))
  }
}
