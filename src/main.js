import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from "./utilities/firebase";
import directives from '@/directives/index'


const app = createApp(App)

directives.forEach(directive => {
    console.log(directive)
    app.directive(directive.name, directive)  // register directives
})


app
    .use(store)
    .use(firebase)
    .use(router)
    .mount('#app')
