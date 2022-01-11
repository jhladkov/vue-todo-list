import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from "./utilities/firebase";


createApp(App)
    .use(store)
    .use(firebase)
    .use(router)
    .mount('#app')
