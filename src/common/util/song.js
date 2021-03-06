import { getSongsUrl } from '../../api/song'
// TODO:util song
// 整理获取到的数据
export default class Song {
  constructor({ id, mid, singer, name, album, duration, singerMid, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.singer_mid = singerMid
    this.filename = `C400${this.mid}.m4a`
    this.url = url
  }
}

// 判断歌曲是否可用
export function isValidMusic (musicData) {
  return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0)
}
// 对单个歌曲的数据进行处理
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    singerMid: musicData.singer[0].mid,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: musicData.url
  })
}
/**
 * 规范化歌手名
 * @param {Array} singer 一个数组中包含对象，对象必须拥有name选项
 */
export function filterSinger(singer) {
  const ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join(' / ')
}
// 给所有歌曲传入url
export function processUrl(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return getSongsUrl(songs).then(purlMap => {
    songs = songs.filter(song => {
      const purl = purlMap[song.mid]
      if (purl) {
        song.url = purl.indexOf('http') === -1 ? `http://dl.stream.qqmusic.qq.com/${purl}` : purl
        return song
      }
    })
    return songs
  })
}
