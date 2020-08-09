import axios from 'axios'

import { jsonpCommonParams, jsonpOptions } from './config'
import Request from '../common/util/request'

const request = new Request()

export function getHotKey () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, jsonpCommonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return request.jsonp(url, data, jsonpOptions)
}

/**
 *
 * @param {*} query 输入的内容
 * @param {Number} page 当前所在页码
 * @param {Boolean} zhida 是否需要检索歌手
 * @param {Number} perpage 每页返回的数据数量
 */
export function search(query, page, zhida, perpage) {
  const url = '/api/search'

  const data = Object.assign({}, jsonpCommonParams, {
    w: query,
    p: page,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5',
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
