import Vue from 'vue'
import Router from 'vue-router'
import recommend from './../components/recommend'
import singer from './../components/singer'
import rank from './../components/rank'
import search from './../components/search'
import singerdetail from './../components/singerdetail'
import rankdetail from './../components/rankdetail'
import songListdetail from './../components/songListdetail'
Vue.use(Router)
export default new Router({
    routes: [{
            path: '/',
            component: recommend,
            redirect: '/recommend'
        },
        {
            path: '/recommend',
            component: recommend,
            children: [{
                path: ':id',
                name: 'songlistdetail',
                component: songListdetail
            }]
        },
        {
            path: '/singer',
            component: singer,
            children: [{
                path: ':id',
                component: singerdetail
            }]
        },
        {
            path: '/rank',
            component: rank,
            children: [{
                path: ':id',
                name: 'rankdetail',
                component: rankdetail
            }]
        },
        {
            path: '/search',
            component: search,
            children: [{
                path: ':id',
                component: singerdetail
            }]
        },
    ]
})