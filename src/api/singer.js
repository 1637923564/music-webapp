import Request from '../common/util/request'
import * as config from './config'

const request = new Request()

export function getSingers() {
  const URL = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const params = Object.assign({}, config.jsonpCommonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 2,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })
  return request.jsonp(URL, params, config.jsonpOptions)
    .then(res => {
      return res
    })
}

export function getSingerDetail(singerId) {
  const URL = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const params = Object.assign({}, config.jsonpCommonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  })
  return request.jsonp(URL, params, config.jsonpOptions)
    .then(res => {
      return res
    })
}
