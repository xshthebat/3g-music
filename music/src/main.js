import Vue from 'vue'
import App from './App'
import router from './router'
import fastlick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import './common/css/index.css'
import store from './store/index'
//去除300ms
fastlick.attach(document.body);

Vue.config.productionTip = false

Vue.use(VueLazyLoad, {
    loading: require('./common/image/loding.png')
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})