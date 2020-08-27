import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
// import Rank from '../views/rank/Rank'
// import Recommend from '../views/recommend/Recommend'
// import Search from '../views/search/Search'
// import Singer from '../views/singer/Singer'
// import SingerDetail from '../views/singer-detail/SingerDetail'
// import DiscDetail from '../views/disc-detail/DiskDetail'
// import RankDetail from '../views/rank-detail/RankDetail'
// import MyCenter from '../views/my-center/MyCenter'

Vue.use(VueRouter)

// // 懒加载
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
  if (store.state.fullScreen) {
    store.commit('setFullScreen', false)
    next(false)
  } else {
    next()
  }
})

export default router
