import Vue from 'vue'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import App from './App.vue'
import store from './store'
import router from './router'
import './common/stylus/index.styl'

Vue.use(VueLazyload, {
  loading: require('./common/image/default.png')
})

fastclick.attach(document.body)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
