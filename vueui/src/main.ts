// Enable Immer MapSet plugin before any store/reducer runs (ide-core state may contain Set in tree data).
import { enableMapSet } from 'immer';
enableMapSet();

import './index.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(VueMonacoEditorPlugin, {
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.54.0/min/vs',
  },
});
app.mount('#app');
