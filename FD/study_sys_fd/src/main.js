import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import './assets/styles/global.css'
import 'element-plus/dist/index.css'



const pinia = createPinia();
createApp(App).use(store).use(router).use(ElementPlus).use(pinia).mount('#app')
