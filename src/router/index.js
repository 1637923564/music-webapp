import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const Recommend = () => import('../views/recommend/Recommend')
const Rank = () => import('../views/rank/Rank')
const Search = () => import('../views/search/Search')
const Singer = () => import('../views/singer/Singer')
const SingerDetail = () => import('../views/singer-detail/SingerDetail')
const DiscDetail = () => import('../views/disc-detail/DiskDetail')
const RankDetail = () => import('../views/rank-detail/RankDetail')
const MyCenter = () => import('../views/my-center/MyCenter')

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/recommend' },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: DiscDetail
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        { path: ':id', component: SingerDetail }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: RankDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        { path: ':id', component: SingerDetail }
      ]
    },
    {
      path: '/center',
      component: MyCenter
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (store.state.fullScreen || store.state.showPlaylist) {
    store.commit('setFullScreen', false)
    store.commit('setShowPlaylist', false)
    next(false)
  } else {
    next()
  }
})

export default router
