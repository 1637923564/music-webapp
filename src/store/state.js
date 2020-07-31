import { playMode } from '../common/config'

export default {
  singer: {},
  playing: false, // 是否播放
  fullScreen: false, // 控制播放页面是否全屏
  playList: [], // 播放列表
  sequenceList: [], // 在某个播放模式下进行相应的排序的播放列表
  mode: playMode.sequence, // 控制播放模式
  currentIndex: -1 // 当前播放的歌
}
