import { playMode, storageKey } from '../common/config'
import Storage from '../common/util/cache'

const STORAGE_SEARCH = storageKey.search
const STORAGE_PLAY = storageKey.play

const storage = new Storage()

export default {
  singer: {},
  playing: false, // 是否播放
  fullScreen: false, // 控制播放页面是否全屏
  playList: [], // 播放列表
  sequenceList: [], // 默认的播放列表(顺序播放)
  mode: playMode.sequence, // 控制播放模式
  currentIndex: -1, // 当前播放的歌
  disk: {},
  rank: {},
  searchHistory: storage.val(STORAGE_SEARCH),
  showPlaylist: false, // 是否展示播放列表
  playHistory: storage.val(STORAGE_PLAY)
}
