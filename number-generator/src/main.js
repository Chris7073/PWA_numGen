import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.mount('#app');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('Service Worker registrato!'))
    .catch(err => console.error('Errore Service Worker:', err));
}
