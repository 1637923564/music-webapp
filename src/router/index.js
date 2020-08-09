import Vue from 'vue'
import VueRouter from 'vue-router'
import Rank from '../views/rank/Rank'
import Recommend from '../views/recommend/Recommend'
import Search from '../views/search/Search'
import Singer from '../views/singer/Singer'
import SingerDetail from '../views/singer-detail/SingerDetail.vue'
import DiscDetail from '../views/disc-detail/DiskDetail.vue'
import RankDetail from '../views/rank-detail/RankDetail.vue'

Vue.use(VueRouter)

export default new VueRouter({
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
    }
  ]
})
