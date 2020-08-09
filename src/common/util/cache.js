export default class Storage {
  /**
   * 用于设置或者获取本地localStorage
   * @param {String} key
   * @param {*} value
   */
  val(key, value) {
    if (value) {
      const str = JSON.stringify(value)
      localStorage.setItem(key, str)
    } else {
      const ret = JSON.parse(localStorage.getItem(key))
      return ret
    }
  }

  del(key) {
    localStorage.removeItem(key)
  }

  /**
   * 当存储在本地的数据为类数组的字符串时，为这个类数组添加元素
   * @param {*} options
   * @param {*} options.key
   * @param {*} options.val
   * @param {*} options.maxLen 类数组的最大长度
   * @param {*} options.target 需要删除的对象的某个属性
   */
  insert(options) {
    const data = this.val(options.key)
    const target = options.target
    const type = Object.prototype.toString.call(options.val)
    const index = data.findIndex(item => {
      if (target) {
        if (type !== '[object Object]' && type !== '[object Array]') {
          throw new Error('The option "target" is redundant')
        }
        return item[target] === options.val[target]
      } else {
        return item === options.val
      }
    })

    if (index === 0) {
      return data
    }
    if (index > 0) {
      data.splice(index, 1)
    }
    data.unshift(options.val)

    if (options.maxLen && options.maxLen < data.length) {
      data.pop()
    }

    this.val(options.key, data)
    return data
  }

  remove(key, index) {
    let data = this.val(key)
    if (typeof index === 'number' && index >= 0) {
      data.splice(index, 1)
      this.val(key, data)
    } else {
      this.del(key)
      data = []
    }
    return data
  }
}
