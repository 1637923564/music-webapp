import { getUid } from '../common/util/uid'
import { jsonpCommonParams, ERR_OK } from './config'
import axios from 'axios'
// TODO:api song
export function getSongsUrl(songs) {
  const url = '/api/getPurlUrl'

  const mids = []
  const types = []

  songs.forEach((song) => {
    mids.push(song.mid)
    types.push(0)
  })

  const urlMid = genUrlMid(mids, types)

  const data = Object.assign({}, jsonpCommonParams, {
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  })

  return new Promise((resolve, reject) => {
    let tryTime = 3

    function request() {
      return axios.post(url, {
        comm: data,
        req_0: urlMid
      }).then(res => {
        // console.log(res)
        const ret = res.data
        if (ret.code === ERR_OK) {
          const urlMid = ret.req_0
          if (urlMid && urlMid.code === ERR_OK) {
            const purlMap = {}

            urlMid.data.midurlinfo.forEach(item => {
              if (item.purl) {
                purlMap[item.songmid] = item.purl
              }
            })

            if (Object.keys(purlMap).length) {
              resolve(purlMap)
            } else {
              retry()
            }
          } else {
            retry()
          }
        } else {
          retry()
        }
      })
    }

    function retry () {
      if (--tryTime >= 0) {
        request()
      } else {
        reject(new Error('Can not get the songs url'))
      }
    }
    request()
  })
}

function genUrlMid (mids, types) {
  const guid = getUid()
  return {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}
