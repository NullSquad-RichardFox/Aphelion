import { createApp } from 'vue'
import { IonicVue } from '@ionic/vue';
import router from './router/router.js'
import App from './App.vue'

import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite';

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
        
        const ret = await sqlite.checkConnectionsConsistency();
        const isConn = (await sqlite.isConnection('db_aphelion', false)).result;
        let db = null;
        if (ret.result && isConn) {
            db = await sqlite.retrieveConnection('db_aphelion', false);
        } else {
            db = await sqlite.createConnection('db_aphelion', false, 'no-encryption', 1, false);
        }
        
        await db.open();
        const querry = `
            CREATE TABLE IF NOT EXISTS text (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT NOT NULL
            );
        `;

        const res = await db.execute(querry);
        console.log(`res: ${JSON.stringify(res)}`);
        await sqlite.closeConnection('db_aphelion', false);

        const app = createApp(App).use(IonicVue).use(router);
        router.isReady().then(() => {
            app.mount('#app');
        })
    } catch (e) {
        console.log(e.message);
    }
})