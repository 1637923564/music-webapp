import Request from '../common/util/request'
import { commonParams, commonHeaders, jsonpCommonParams } from './config'

const request = new Request()

// 轮播图api
export function getTopBanner() {
  const URL = '/api/getTopBanner'
  // 约定的后台访问第三方接口时需要传入的参数(原网站访问该接口时使用的参数)
  const params = {
    pageSize: 10,
    nid: 23831003,
    pageNo: 0,
    type: 2006
  }
  // 约定的后台访问第三方接口时需要传入的请求头(原网站访问该接口时使用的请求头)
  const headers = {
    Host: 'm.music.migu.cn',
    Referer: 'https://m.music.migu.cn/v3'
  }
  return request.accessProxy({
    url: URL,
    params,
    headers
  })
    .then(res => {
      return res
    })
}
// 歌单api
export function getRecommendList() {
  const URL = '/api/getRecommendList'
  const params = {
    picmid: 1,
    rnd: Math.random(),
    g_tk_new_20200303: 1248420552,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 19
  }
  Object.assign(params, commonParams)
  const headers = commonHeaders
  return request.accessProxy({
    url: URL,
    params,
    headers
  })
    .then(res => {
      return res
    })
}
// 歌单详情api
export function getSongList(disstid) {
  const URL = '/api/getCdInfo'
  const params = Object.assign({}, jsonpCommonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  })
  const headers = {
    referer: 'https://c.y.qq.com/',
    host: 'c.y.qq.com'
  }
  request.accessProxy({
    url: URL,
    headers,
    params
  })
  return request.accessProxy({
    url: URL,
    headers,
    params
  }).then(res => {
    return res
  })
}
