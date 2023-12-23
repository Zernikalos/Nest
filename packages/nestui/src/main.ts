import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createNestStore} from "@zernikalos/store";

import './assets/main.css'

const app =  createApp(App)

app.use(router)
createNestStore(app)

app.mount('#app')
