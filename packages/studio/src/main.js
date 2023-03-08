import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createStudioStore} from "@mrrobotto/store/src";

import './assets/main.css'

const app =  createApp(App)

app.use(router)
createStudioStore(app)

app.mount('#app')
