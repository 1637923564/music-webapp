const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')

const app = express()

const ERR_OK = 0

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(express.static('./dist'))

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
app.get('/api/lyric', (req, res) => {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    let ret = response.data
    if (typeof ret === 'string') {
      const reg = /^\w+\(({.+})\)$/
      const matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    throw e
  })
})
app.post('/api/getCdInfo', function (req, res) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  const params = req.body.params
  const headers = req.body.headers
  axios.get(url, {
    headers,
    params
  }).then((response) => {
    let ret = response.data
    if (typeof ret === 'string') {
      const reg = /^\w+\(({.+})\)$/
      const matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    throw e
  })
})
app.get('/api/search', function (req, res) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    throw e
  })
})

app.listen(3000, () => {
  console.log('http://localhost:3000')
})
