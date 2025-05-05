import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/base.css'

if (sessionStorage.redirect) {
    const fullPath = sessionStorage.redirect;
    delete sessionStorage.redirect;

    const basePath = '/vue-chess/';
    const routePath = fullPath.startsWith(basePath) 
        ? fullPath.slice(basePath.length - 1) 
        : fullPath;

    router.replace(routePath).catch(() => {});
}

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');