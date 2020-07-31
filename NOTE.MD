### 歌手界面和快捷栏的联动效果：
---
1. **歌手界面滚动，快捷栏样式变化**的实现
>* 通过 DOM 的 clienHeight 获取每个分类的高度
>* 元素之间相加，得到元素的位置信息 (分类盒子上边框到被滚动的容器的顶部的位置)，并依次存入数组
>* 遍历数组，判断被滚动元素的位置再数组的哪一个区间，从而获取相应的索引，这个索引与快捷栏索引相对应
>* 通过索引设置快捷栏相应元素的样式
2. **点击快捷栏，歌手界面滚动到相应位置**的实现
>* 获取被点击元素的索引
>* 利用 ***better-scroll*** 内置的 ***scrollToElement*** 方法实现滚动  
>* 注：如果滚动条被包裹在 **better-scroll初始化了的容器** 内部点击快捷栏虽然也能跳转，但不能实现动画效果
3. **滑动快捷栏，歌手界面滚动到相应位置**的实现
>* 通过 **touchstart** 事件获取滑动的初始位置的索引。
>* 通过 **event.touches[0].clientY** ，记录下滑动的初始坐标
>* 通过 **touchmove** 事件的 **event.touches[0].clientY** 实时获取滑动到的坐标，并实时与初始坐标相减
>* 索引 = 相减的结果 / 快捷按钮的个数
>* 利用 ***better-scroll*** 内置的 ***scrollToElement*** 方法实现滚动

### 播放器界面唱片的缩放特性实现
---
>* HTML中在 transition 标签上声明 JavaScript 钩子
```html
<transition name="normal"
            @enter="enter"
            @after-enter="afterEnter"
            @leave="leave"
            @after-leave="afterLeave"
>
<!-- ... -->
</transition>
```
>* JavaScript 中获取小唱片相对于大唱片的偏移量
>* 打开播放界面时、动画执行之前，通过 create-keyframe-animation 注册一个animation
```javascript
enter(el, done) {
  // ...
  animations.registerAnimation({
    name: 'move',
    animation: {
      0: {
        transform: `translate(${x}px, ${y}px) scale(${scale})`
      },
      60: {
        transform: 'translate(0, 0) scale(1.1)'
      },
      100: {
        transform: 'translate(0, 0) scale(1)'
      }
    },
    presets: {
      duration: 400,
      easing: 'linear'
    }
  })
  // 注册之后记得执行它
  animations.runAnimation(this.$refs.normalCD, 'move', done)
}
```
>* 动画执行完成之后将 animation 注销掉，并清空css动画样式
```javascript
afterEnter() {
  animations.unregisterAnimation('move')
  this.$refs.normalCD.style.animation = ''
}
```
>* 播放器界面关闭时、动画执行之前，设置其过渡效果(位置偏移和缩放)
>* 动画执行完毕之后，将设置的动画效果清空