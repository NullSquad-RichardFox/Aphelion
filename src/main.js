import { createApp } from 'vue'
import { IonicVue } from '@ionic/vue';
import router from './router/router.js'

import './style.css'
import App from './App.vue'

createApp(App).use(IonicVue).use(router).mount('#app')
