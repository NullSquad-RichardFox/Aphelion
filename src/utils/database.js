import { SQLiteConnection, CapacitorSQLite } from "@capacitor-community/sqlite";
    
const sqlite = new SQLiteConnection(CapacitorSQLite);
let db = null;  

async function dropDatabase() {
    await db.open();
    
    await db.execute(`DROP TABLE workoutTemplates`);
    await db.execute(`DROP TABLE exercises`);
    await db.execute(`DROP TABLE currentWorkout`);

    await db.close();
}

async function createDatabase() {
    await db.open();
    try {
        await db.execute(`CREATE TABLE workoutTemplates (        
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            exercises TEXT,
            sets TEXT
            )`);

        await db.execute(`CREATE TABLE exercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            musclesPrimary TEXT,
            musclesSecondary TEXT,
            data TEXT,
            personalBest REAL
            )`);

        await db.execute(`CREATE TABLE currentWorkout (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT,
            timer INTEGER,
            editMode BOOLEAN,
            exercises TEXT
            )`);

        await populateDatabase();   
    } catch (e) {
        console.log(e)
    }

    await db.close();
}

async function populateDatabase() {
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Dumbbell Biceps Curl", JSON.stringify(['biceps']), JSON.stringify(['forearms']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Barbell Biceps Curl", JSON.stringify(['biceps']), JSON.stringify(['forearms']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Machine Biceps Curl", JSON.stringify(['biceps']), JSON.stringify(['forearms']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Cable Curl with Rope", JSON.stringify(['biceps']), JSON.stringify(['forearms']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Cable Curl with Bar", JSON.stringify(['biceps']), JSON.stringify(['forearms']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Incline Dumbbell Curl", JSON.stringify(['biceps']), JSON.stringify(['forearms']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Hammer Curl", JSON.stringify(['forearms']), JSON.stringify(['biceps']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Overhead Triceps Extensions", JSON.stringify(['triceps']), JSON.stringify([]), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Triceps Pushdown with Rope", JSON.stringify(['triceps']), JSON.stringify(['front delts']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Triceps Pushdown with Bar", JSON.stringify(['triceps']), JSON.stringify(['front delts']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Triceps Kickback", JSON.stringify(['triceps']), JSON.stringify([]), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Smith-Machine Skullcrusher", JSON.stringify(['triceps']), JSON.stringify(['chest', 'front delts']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Skullcrusher", JSON.stringify(['triceps']), JSON.stringify(['chest', 'front delts']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Cable Front Raise", JSON.stringify(['front delts']), JSON.stringify(['mid delts']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Dumbbell Front Raise", JSON.stringify(['front delts']), JSON.stringify(['mid delts']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Dumbbell Shoulder Press", JSON.stringify(['front delts']), JSON.stringify(['mid delts', 'chest']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Machine Shoulder Press", JSON.stringify(['front delts']), JSON.stringify(['mid delts', 'chest']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Smith-Machine Shoulder Press", JSON.stringify(['front delts']), JSON.stringify(['mid delts', 'chest']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Cable Lateral Raise", JSON.stringify(['mid delts']), JSON.stringify(['traps']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Cable Upright Row", JSON.stringify(['mid delts']), JSON.stringify(['traps']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Dumbbell Lateral Raise", JSON.stringify(['mid delts']), JSON.stringify(['traps']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Machine Lateral Raise", JSON.stringify(['mid delts']), JSON.stringify(['traps']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Cable Face Pull", JSON.stringify(['rear delts']), JSON.stringify(['traps', 'mid delts']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Machine Reverse Fly", JSON.stringify(['rear delts']), JSON.stringify([]), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Cable Crunch", JSON.stringify(['abs']), JSON.stringify(['obliques']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Weighted Crunch", JSON.stringify(['abs']), JSON.stringify(['obliques']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Machine Crunch", JSON.stringify(['abs']), JSON.stringify(['obliques']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Leg Raise", JSON.stringify(['abs']), JSON.stringify(['obliques']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Back Extension", JSON.stringify(['lower back']), JSON.stringify([]), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Barbell Deadlift", JSON.stringify(['lower back', 'glutes']), JSON.stringify(['biceps', 'quads', 'hamstrings', 'calfs']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Pull-Up", JSON.stringify(['traps', 'lats']), JSON.stringify(['lower back', 'biceps']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Barbell Row", JSON.stringify(['traps', 'lats']), JSON.stringify(['lower back', 'biceps']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Smith-Machine Row", JSON.stringify(['traps', 'lats']), JSON.stringify(['lower back', 'biceps']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Chest Supported Machine Row", JSON.stringify(['traps', 'lats']), JSON.stringify(['lower back', 'biceps']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Cable Wide Grip Seated Row", JSON.stringify(['traps']), JSON.stringify(['lats', 'biceps']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["T-Bar Row", JSON.stringify(['traps']), JSON.stringify(['lats', 'biceps']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Lat Pulldown", JSON.stringify(['traps']), JSON.stringify(['lats', 'biceps', 'lower back']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Lat Prayers", JSON.stringify(['traps']), JSON.stringify(['lats', 'biceps', 'lower back']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Chin-Up", JSON.stringify(['lats']), JSON.stringify(['traps', 'biceps', 'lower back']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Close Grip Lat Pulldown", JSON.stringify(['lats']), JSON.stringify(['traps', 'biceps']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Cable Close Grip Seated Row", JSON.stringify(['lats']), JSON.stringify(['traps', 'biceps']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Neutral Grip Pull-Up", JSON.stringify(['lats']), JSON.stringify(['traps', 'biceps']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Dip", JSON.stringify(['chest', 'triceps']), JSON.stringify(['front delts']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Bench Press", JSON.stringify(['chest']), JSON.stringify(['triceps', 'front delts']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Dumbbell Chest Press", JSON.stringify(['chest']), JSON.stringify(['triceps', 'front delts']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Cable Chest Fly", JSON.stringify(['chest']), JSON.stringify(['biceps', 'front delts']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Dumbbell Chest Fly", JSON.stringify(['chest']), JSON.stringify(['biceps', 'front delts']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Machine Chest Fly", JSON.stringify(['chest']), JSON.stringify(['biceps', 'front delts']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Machine Chest Press", JSON.stringify(['chest']), JSON.stringify(['triceps', 'front delts']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Incline Bench Press", JSON.stringify(['chest']), JSON.stringify(['triceps', 'front delts']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Incline Dumbbell Chest Press", JSON.stringify(['chest']), JSON.stringify(['triceps', 'front delts']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Incline Dumbbell Chest Fly", JSON.stringify(['chest']), JSON.stringify(['biceps', 'front delts']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Barbell Squat", JSON.stringify(['quads']), JSON.stringify(['lower back', 'glutes']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Smith-Machine Squat", JSON.stringify(['quads']), JSON.stringify(['lower back', 'glutes']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Dumbbell Squat", JSON.stringify(['quads']), JSON.stringify(['lower back', 'glutes']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Pendulum Squat", JSON.stringify(['quads']), JSON.stringify(['lower back', 'glutes']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Hacks Machine Squat", JSON.stringify(['quads']), JSON.stringify(['lower back', 'glutes']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Leg Press", JSON.stringify(['quads']), JSON.stringify(['calfs', 'glutes']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Leg Extensions", JSON.stringify(['quads']), JSON.stringify([]), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Leg Curls", JSON.stringify(['hamstrings']), JSON.stringify(['calfs']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Lying Leg Curls", JSON.stringify(['hamstrings']), JSON.stringify(['calfs']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Dumbbell Romanian Deadlift", JSON.stringify(['hamstrings', 'glutes']), JSON.stringify(['forearms', 'lower back']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Barbell Romanian Deadlift", JSON.stringify(['hamstrings', 'glutes']), JSON.stringify(['forearms', 'lower back']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Hip Thrust", JSON.stringify(['glutes']), JSON.stringify(['quads', 'calfs']), JSON.stringify([]), 0]);
    await db.query(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data, personalBest) VALUES (?,?,?,?,?)`, ["Standing Calf Raises", JSON.stringify(['calfs']), JSON.stringify(['lower back']), JSON.stringify([]), 0]);
}

async function loadDatabase() {
    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection('db_aphelion', false)).result;
    
    if (ret.result && isConn) {
        db = await sqlite.retrieveConnection('db_aphelion', false);
    } else {
        db = await sqlite.createConnection('db_aphelion', false, 'no-encryption', 1, false);
    }

    await createDatabase();
}

function closeDatabase() {
    sqlite.closeConnection('db_aphelion', false);
}

async function queryDatabase(querry, data) {
    try {
        await db.open();
        const res = await db.query(querry, data);     
        await db.close();
        return res;
    } catch (e) {
        console.error(e);
        return [];
    }
}

export {
    loadDatabase, closeDatabase, queryDatabase, dropDatabase, createDatabase
}