import { SQLiteConnection, CapacitorSQLite } from "@capacitor-community/sqlite";
    
const sqlite = new SQLiteConnection(CapacitorSQLite);
let db = null;  

async function loadDatabase() {
    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection('db_aphelion', false)).result;
    
    if (ret.result && isConn) {
        db = await sqlite.retrieveConnection('db_aphelion', false);
    } else {
        db = await sqlite.createConnection('db_aphelion', false, 'no-encryption', 1, false);
    }

    await db.open();

    await db.execute(`CREATE TABLE IF NOT EXISTS workoutTemplates (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        exercises TEXT,
        sets TEXT
    );`);

    await db.execute(`CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT,
        musclesWorked TEXT,
        data TEXT
    );`) // data = [ { workoutId, date, sets, weights } ]

    await db.execute(`CREATE TABLE IF NOT EXISTS currentWorkout (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT,
        timer INTEGER,
        exerciseIds TEXT,
        exerciseNames TEXT,
        setsTotal TEXT,
        setsWorked TEXT,
        weights TEXT
    );`)

    await db.close();
}

function closeDatabase() {
    sqlite.closeConnection('db_aphelion', false);
}

async function querryDatabase(querry, data) {
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
    loadDatabase, closeDatabase, querryDatabase
}