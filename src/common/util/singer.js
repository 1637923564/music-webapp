export default class Singer {
  /**
   * @param {String} name 歌手名
   * @param {String}} id 歌手的id
   */
  constructor(name, id) {
    this.name = name
    this.id = id
  }

  /**
   * 在歌手信息中添加一个avatar(头像地址)
   */
  addAvatar() {
    const avatar = `https://y.gtimg.cn/music/photo_new/T001R500x500M000${this.id}.jpg?max_age=2592000`
    return {
      name: this.name,
      id: this.id,
      avatar
    }
  }
}
