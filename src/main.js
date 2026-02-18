import { createApp } from 'vue'
import { IonicVue } from '@ionic/vue';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite';
import { loadDatabase } from './utils/database';
import router from './router/router.js'
import App from './App.vue'


import './style.css'

customElements.define('jeep-sqlite', JeepSqlite);

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const platfrom = Capacitor.getPlatform();
        const sqlite = new SQLiteConnection(CapacitorSQLite);
        
        if (platfrom === 'web') {
            const jeepSqliteEl = document.createElement('jeep-sqlite');
            document.body.appendChild(jeepSqliteEl);
            await customElements.whenDefined('jeep-sqlite');
            await sqlite.initWebStore();
        }

        await loadDatabase();

        const app = createApp(App).use(IonicVue).use(router);
        router.isReady().then(() => {
            app.mount('#app');
        })
    } catch (e) {
        console.log(e.message);
    }
})