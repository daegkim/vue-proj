import Vue from 'vue'
import Base from './Base.vue'
import router from './router'

new Vue({
  el: '#app',
  router,
  render: h => h(Base)
})
