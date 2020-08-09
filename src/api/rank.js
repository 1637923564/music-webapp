import { jsonpCommonParams, jsonpOptions } from './config'
import Request from '../common/util/request'

const request = new Request()

export function getTopList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, jsonpCommonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return request.jsonp(url, data, jsonpOptions)
}

export function getMusicList (topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, jsonpCommonParams, {
    topid,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5'
  })

  return request.jsonp(url, data, jsonpOptions)
}
