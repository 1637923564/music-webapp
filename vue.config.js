const axios = require('axios')
const bodyParser = require('body-parser')

const ERR_OK = 0

module.exports = {
  devServer: {
    port: 80,
    before(app) {
      // parse application/x-www-form-urlencoded
      app.use(bodyParser.urlencoded({ extended: false }))
      // parse application/json
      app.use(bodyParser.json())
      // 将第三方接口转换成本地接口，并提供给客户端调用
      app.post('/api/getTopBanner', (req, res) => {
        const URL = 'https://m.music.migu.cn/migu/remoting/cms_list_tag'
        const headers = req.body.headers
        const params = req.body.params
        // 访问第三方接口，请求头及参数与原网站调用该接口时保持一致
        axios.get(URL, {
          headers,
          params
        }).then(res2 => {
          const response = res2.data.result
          const content = response && response.results
          const slider = { code: 1 }
          if (content[0]) {
            slider.code = ERR_OK
            slider.results = []
            // 我们只需要使用它的id、图片和点击后访问的地址
            content.forEach(item => {
              const tem = {}
              const oldSlider = item.linkData
              tem.id = oldSlider.linkId
              tem.url = oldSlider.linkPicUrl
              tem.linkUrl = oldSlider.linkUrl
              slider.results.push(tem)
            })
          }
          res.json(slider)
        }).catch(e => {
          throw e
        })
      })
      app.post('/api/getRecommendList', (req, res) => {
        const URL = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        const headers = req.body.headers
        const params = req.body.params
        axios.get(URL, {
          headers,
          params
        }).then(res2 => {
          const response = res2.data
          if (response.code === ERR_OK) {
            res.json(response)
          }
        }).catch(e => {
          throw e
        })
      })
      app.post('/api/getMusics', (req, res) => {
        const URL = 'https://u.y.qq.com/cgi-bin/musics.fcg'
        const headers = req.body.headers
        const params = req.body.params
        axios.get(URL, {
          headers,
          params
        }).then(res2 => {
          const response = res2.data
          if (response.code === ERR_OK) {
            res.json(response)
          }
        }).catch(e => {
          throw e
        })
      })
      app.post('/api/getPurlUrl', (req, res) => {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.post(url, req.body, {
          headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com',
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(response => {
          const ret = response.data
          if (ret.code === ERR_OK) {
            res.json(ret)
          }
        }).catch(e => {
          throw e
        })
      })
    }
  }
}
