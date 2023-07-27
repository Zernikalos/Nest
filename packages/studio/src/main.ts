import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createStudioStore} from "@zernikalos/store";

import './assets/main.css'

const app =  createApp(App)

app.use(router)
createStudioStore(app)

app.mount('#app')
