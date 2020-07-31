import originJsonp from 'jsonp'
import axios from 'axios'
import Util from './index'

const util = new Util()

export default class Request {
  /**
   * 自定义一个支持Promis的jsonp
   * @param {String} url 请求地址
   * @param {Object} data url的参数
   * @param {Object} options 选项
   * @param {String} options.param 与后端约定请求的字段名称，默认是callback
   * @param {String} options.prefix 指定回调函数params的回调句柄前缀，默认为__jp
   * @param {String} options.name 指定回调函数的句柄 默认是__jp+数字
   * @param {String} options.timeout 设定一个响应时间，默认为60000ms，如果在设定设计内没有响应，则会提交error
   */
  jsonp(url, data, options) {
    // 将参数data与url拼接
    url += ((url.indexOf('?') < 0) ? '?' : '&') + util.convertsQuery(data)
    return new Promise((resolve, reject) => {
      originJsonp(url, options, (err, data) => {
        if (!err) {
          resolve(data)
        } else {
          reject(err)
        }
      })
    })
  }

  /**
   * 向代理服务器发送一个XMLHttpRequests请求
   * @param {Object} arg
   * @param {String} arg.url 请求路径
   * @param {String} arg.headers 后台访问第三方接口时需要传入的参数(原网站访问该接口时使用的参数)
   * @param {String} arg.params 后台访问第三方接口时需要传入的请求头(原网站访问该接口时使用的请求头)
   */
  accessProxy(arg) {
    const URL = arg.url
    const data = {
      headers: arg.headers,
      params: arg.params
    }
    return axios.post(URL, data)
      .then(res => {
        return res.data
      })
  }
}
