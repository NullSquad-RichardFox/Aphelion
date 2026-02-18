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

async function loadDatabase() {
    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection('db_aphelion', false)).result;
    
    if (ret.result && isConn) {
        db = await sqlite.retrieveConnection('db_aphelion', false);
    } else {
        db = await sqlite.createConnection('db_aphelion', false, 'no-encryption', 1, false);
    }

    await db.open();

    await db.execute(`DROP TABLE workoutTemplates`);
    await db.execute(`DROP TABLE exercises`);
    await db.execute(`DROP TABLE currentWorkout`);

    await db.execute(`CREATE TABLE workoutTemplates (        
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        exercises TEXT,
        sets TEXT
        )`);

    await db.execute(`CREATE TABLE exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        musclesWorked TEXT,
        data TEXT
        )`);

    await db.execute(`CREATE TABLE currentWorkout (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT,
        timer INTEGER,
        editMode BOOLEAN,
        exercises TEXT,
        setsTotal TEXT,
        setsWorked TEXT,
        weights TEXT
        )`);

    await db.close();
}

function closeDatabase() {
    sqlite.closeConnection('db_aphelion', false);
}

async function queryDatabase(querry, data) {
    console.log(querry ,data);
    
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
    loadDatabase, closeDatabase, queryDatabase
}