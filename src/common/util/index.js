// TODO:util.js
/**
 * 工具类
 * @class
 */
export default class Util {
  constructor() {
    this.vender = vendor()
  }

  /**
   * 为元素节点添加新的类
   * @param {*} el 目标元素节点
   * @param {*} className 需要进行添加的类名
   */
  addClass(el, className) {
    if (!this.hasClass(el, className)) {
      el.className += el.className === ''
        ? className
        : ` ${className}`
    }
  }

  /**
   * 判断元素节点是否存在某个类名
   * @param {*} el 目标元素节点
   * @param {*} className 需要进行检索的类名
   */
  hasClass(el, className) {
    const reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
  }

  /**
   * 将对象转换为"&key=value&key2=value2"
   * @param {*} data 需要进行操作的对象
   */
  convertsQuery(data) {
    if (!(Object.prototype.toString.call(data) === '[object Object]')) {
      throw new Error('convertsQuery的参数必须传入一个对象')
    }
    let url = ''
    let key
    let value
    for (key in data) {
      value = data[key] !== undefined
        ? data[key]
        : ''
      url += `&${key}=${encodeURIComponent(value)}`
    }
    return url ? url.substring(1) : ''
  }

  /**
   * 设置(获取)某元素上的属性值
   * @param {*} el 目标元素节点
   * @param {String} attrName 数据的名称
   * @param {*} val 需要设置的数据(是否填写该参数决定了该方法是getter还是setter)
   */
  attr(el, attrName, val) {
    const prefix = 'data-'
    const name = prefix + attrName
    if (val) {
      return el.setAttribute(name, val)
    } else {
      return el.getAttribute(name)
    }
  }

  /**
   * 获取目标元素到父容器顶部的距离，并将其放进同一个数组
   * @param {*} elements 元素节点的集合
   * @return Array 各个元素位置的集合
   */
  getElPosition(elements) {
    const elsLen = elements.length
    const result = [0]
    let position = 0

    for (let i = 0; i < elsLen; i++) {
      position += elements[i].clientHeight
      result.push(position)
    }
    return result
  }

  /**
   * 通过滚动到的位置，获取
   * @param {Array} elPositionSet 一个元素位置的集合
   * @param {Number} currentY 滚动到的位置
   */
  getCurrentIndex(elPositionSet, currentY) {
    const length = elPositionSet.length
    let diffHeight = 0
    let result = 0

    for (let i = 0; i < length; i++) {
      const interval = elPositionSet[i]
      const intervalTo = elPositionSet[i + 1]
      if ((!intervalTo || (currentY <= intervalTo)) && (currentY >= interval)) {
        result = i
        diffHeight = intervalTo - currentY
      }
    }
    return { result, diffHeight }
  }

  /**
   * 对样式作兼容性处理
   * @param {String} style css的属性名
   */
  prefixStyle(style) {
    if (this.vender === false) {
      return false
    }

    if (this.vender === 'standard') {
      return style
    }
    return this.vender + style
  }

  /**
   * 将以秒为单位的时间转换为 m : ss 的分秒形式
   * @param {Number} time 以秒为单位的时间
   */
  normalizeTime(time) {
    const TIME = time | 0
    const RES_MINUTE = TIME / 60 | 0
    const SECOND = TIME % 60
    let resSecond = SECOND.toString()
    while (resSecond.length < 2) {
      resSecond = '0' + resSecond
    }
    return `${RES_MINUTE}:${resSecond}`
  }
}

const elementStyle = document.createElement('div').style
// 利用 css 的 transform 属性来判断该怎么作兼容性处理
function vendor () {
  const transformNames = {
    '-webkit-': '-webkit-transform',
    '-moz-': '-moz-transform',
    '-ms-': '-ms-transform',
    '-o-': '-o-transform',
    standard: 'transform'
  }

  for (const key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
}
