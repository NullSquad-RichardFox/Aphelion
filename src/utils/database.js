import { SQLiteConnection, CapacitorSQLite } from "@capacitor-community/sqlite";
    
const sqlite = new SQLiteConnection(CapacitorSQLite);
let db = null;  

const myTables = [
    {name: 'workoutTemplates', execute: `
        id INTEGER AUTO_INCREMENT NOT NULL,
        name TEXT NOT NULL,
        exercises TEXT,
        sets TEXT,
        PRIMARY KEY (id)
        `}, 
    {name: 'exercises', execute: `
        id INTEGER AUTO_INCREMENT NOT NULL,
        name TEXT,
        musclesWorked TEXT,
        data TEXT,
        PRIMARY KEY (id)
        `}, 
    {name: 'currentWorkout', execute: `
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT,
        timer INTEGER,
        editMode BOOLEAN,
        exercises TEXT,
        setsTotal TEXT,
        setsWorked TEXT,
        weights TEXT
        `}]; // data = [{ workout, date, weights, sets }]

async function dropTable(table) {
    for (item of myTables) {
        if (item.name === table) {
            await db.open();
            await db.execute(`DROP TABLE ${table}`);
            await db.close();
            return;
        }
    }
}

async function createTable(table) {
    for (item of myTables) {
        if (item.name === table) {
            await db.open();
            await db.execute(`CREATE TABLE IF NOT EXISTS ${item.name} (${item.execute});`);
            await db.close();
        }
    }
}

async function loadDatabase() {
    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection('db_aphelion', false)).result;
    
    if (ret.result && isConn) {
        db = await sqlite.retrieveConnection('db_aphelion', false);
    } else {
        db = await sqlite.createConnection('db_aphelion', false, 'no-encryption', 1, false);
    }

    await db.open();

    await dropTable('workoutTemplates');
    await dropTable('exercises');
    await dropTable('currentWorkout');

    await createTable('workoutTemplates');
    await createTable('exercises');
    await createTable('currentWorkout');

    await db.close();
}

function closeDatabase() {
    sqlite.closeConnection('db_aphelion', false);
}

async function queryDatabase(querry, data) {
    try {
        await db.open();
        const res = await db.query(querry , data);
        await db.close();
        return res;     
    } catch (e) {
        console.error(e);
        return [];
    }

}

export {
    loadDatabase, closeDatabase, queryDatabase, dropTable, createTable
}