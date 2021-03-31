import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import { Datetime } from 'vue-datetime'
import { Settings } from 'luxon'
import moment from 'moment'

import 'vue-datetime/dist/vue-datetime.css'
import ChartTemplate from './components/ChartTemplate.vue'
import 'remixicon/fonts/remixicon.css'

//Vue.use(Datetime)
Settings.defaultLocale = 'fr-CA'
moment.locale('fr-CA');
Vue.component('datetime', Datetime);

Vue.component('chart-template', ChartTemplate);

Vue.prototype.$http = axios;
Vue.prototype.$moment = moment;
Vue.prototype.$apiUrl = process.env.VUE_APP_API_URL;

Vue.config.productionTip = false

store.dispatch("init");

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
