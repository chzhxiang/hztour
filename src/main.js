import Vue from 'vue'
import App from './App'
import VueResource from "vue-resource";
import store from "./store"
import router from "./router";


Vue.use(VueResource);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
