<script setup>
import Excercise from '../../components/Excercise.vue';

import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { queryDatabase } from '../../utils/database';
import { isNumeric } from '../../utils/conversion';

const route = useRoute();
const router = useRouter();

const editMode = ref(true);
const workoutId = ref(route.params.id);
const workoutName = ref('');
const workoutExercises = ref([]); // {id, name, sets: {reps: 12, weight: 0, active: false, isPr: false, isWarmUp: warmUp}}

const timerVal = ref(0);
let intervalId = null;

const timeString = computed(() => {
    const hours = Math.floor(timerVal.value / 3600);
    const mins = Math.floor(timerVal.value / 60) - hours * 60;
    const secs = timerVal.value % 60;
    return hours == 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
});

const addExercise = async (id) => {
    const res = await queryDatabase(`SELECT * FROM exercises WHERE id=${id}`);
    workoutExercises.value.push({id: res.values[0].id, name: res.values[0].name, sets: []});
}

const retrieveStoredWorkout = async () => {
    const current = (await queryDatabase(`SELECT * FROM currentWorkout WHERE id=${isNumeric(workoutId.value) ? workoutId.value : -1}`)).values[0];
    
    workoutName.value = current.name;
    timerVal.value = current.timer;
    editMode.value = current.editMode === 1;

    // set workoutExercises 
    const dataExercises = JSON.parse(current.exercises);
    const dataTotal = JSON.parse(current.setsTotal);
    const dataWorked = JSON.parse(current.setsWorked);
    const dataWeights = JSON.parse(current.weights);
    const dataReps = JSON.parse(current.reps);
    const exercises = (await queryDatabase(`SELECT * FROM exercises WHERE id IN (${dataExercises})`)).values;

    let currentSet = 0;
    for (let i = 0; i < dataTotal.length; i++) {
        const ex = exercises.find((v) => v.id === dataExercises[i]);
        let loadedSets = []
        for (let j = 0; j < dataTotal[i]; j++) {
            loadedSets.push({reps: dataReps[currentSet], weight: dataWeights[currentSet], active: j < dataWorked[i], isPr: false, isWarmUp: false});
            currentSet++;
        } 
        workoutExercises.value.push({id: ex.id, name: ex.name, sets: loadedSets})
    }
}

const createWorkout = async () => {
    let exercises = [];
    let sets = [];

    if (!isNumeric(workoutId.value)) {
        // new workout
        workoutName.value = workoutId.value;
        editMode.value = true;
    } else {            
        // old workout
        const res = await queryDatabase(`SELECT * FROM workoutTemplates WHERE id=${workoutId.value}`);
        const workout = res.values[0];
        workoutName.value = workout.name;
        sets = JSON.parse(workout.sets);
        exercises = JSON.parse(workout.exercises);
        editMode.value = history.state.editMode;

        const exerciseData = (await queryDatabase(`SELECT * FROM exercises WHERE id IN (${exercises})`)).values;
        for (let i = 0; i < exercises.length; i++) {
            const data = exerciseData.find((v) => v.id === exercises[i]);
            let loadedSets = []
            for (let j = 0; j < sets[i]; j++) {
                loadedSets.push({reps: 12, weight: 0, active: false, isPr: false, isWarmUp: false})
            } 

            workoutExercises.value.push({id: data.id, name: data.name, sets: loadedSets})
        }
    }

    await queryDatabase(`INSERT INTO currentWorkout (id, name, timer, editMode, exercises, setsTotal, setsWorked, weights, reps) VALUES (?,?,?,?,?,?,?,?,?)`, [
        isNumeric(workoutId.value) ? workoutId.value : -1,
        workoutName.value,
        timerVal.value,
        editMode.value ? 1 : 0,
        JSON.stringify(exercises),
        JSON.stringify(sets),
        JSON.stringify([]),
        JSON.stringify([]),
        JSON.stringify([])
    ]);
}

const loadWorkoutData = async () => {   
    const exists = await queryDatabase(`SELECT EXISTS(SELECT 1 FROM currentWorkout WHERE id=${isNumeric(workoutId.value) ? workoutId.value : -1}) AS workoutExists;`)

    if (exists.values[0].workoutExists === 1) {
        const current = (await queryDatabase(`SELECT * FROM currentWorkout WHERE id=${isNumeric(workoutId.value) ? workoutId.value : -1}`)).values[0]
        if (current.name === workoutId.value) {
            await retrieveStoredWorkout();   
        }
        else {
            await createWorkout();
        }
    }
    else {
        await createWorkout();
    } 
}

const storeTempWorkoutData = async () => {
    let exercises = [];
    let setsTotal = [];
    let setsActive = [];
    let weights = [];
    let reps = [];
    for (const e of workoutExercises.value) {
        exercises.push(e.id);
        setsTotal.push(e.sets == undefined ? 0 : e.sets.length);

        let active = 0;
        for (const s of e.sets) {
            weights.push(s.weight);
            reps.push(s.reps)
            if (s.active) active++;
        }

        setsActive.push(active);
    }

    const res = await queryDatabase(`SELECT EXISTS(SELECT 1 FROM currentWorkout WHERE id=${isNumeric(workoutId.value) ? workoutId.value : -1}) AS workoutExists;`)
    if (res.values[0].workoutExists === 1) {
        await queryDatabase(`UPDATE currentWorkout SET 
            timer='${timerVal.value}', 
            exercises='${JSON.stringify(exercises)}', 
            setsTotal='${JSON.stringify(setsTotal)}', 
            setsWorked='${JSON.stringify(setsActive)}', 
            weights='${JSON.stringify(weights)}', 
            reps='${JSON.stringify(reps)}'
        WHERE id=${isNumeric(workoutId.value) ? workoutId.value : -1}`);
    }
}

onMounted(() => {
    loadWorkoutData().then(() => {
        if (!editMode.value) {
            intervalId = setInterval(() => {
                timerVal.value++;
            }, 1000);
        }

        if (history.state.exercise != undefined) addExercise(history.state.exercise);
    });
});

onUnmounted(() => {
    if (intervalId != null ) {
        clearInterval(intervalId);
    }

    storeTempWorkoutData();
});

const finishWorkout = async () => {
    if (editMode.value) {
        let exs = [];
        let sets = [];
        
        for (const exercise of workoutExercises.value) {
            exs.push(exercise.id);
            sets.push(exercise.sets.length);
        }

        if (isNumeric(workoutId.value)) { // Update existing workout
            await queryDatabase(`UPDATE workoutTemplates SET 
                name='${workoutName.value}', 
                exercises='${JSON.stringify(exs)}', 
                sets='${JSON.stringify(sets)}'
                WHERE id=${workoutId.value}
            `);
        } else { // Add new workout             
            await queryDatabase(`INSERT INTO workoutTemplates (name, exercises, sets) VALUES (?,?,?);`, [
                workoutName.value, 
                JSON.stringify(exs), 
                JSON.stringify(sets)
            ]);
        }
    } else { // Store workout data
        for (const e of workoutExercises.value) {
            const res = await queryDatabase(`SELECT * FROM exercises WHERE id=${e.id}`).values[0];
            let data = JSON.parse(res.data);
            let weights = [];
            let sets = [];

            for (const s of e.sets) {
                if (s.active && !s.isWarmUp) {
                    weights.push(s.weight);
                    sets.push(s.reps);
                }
            }
            
            data.push({workout: workoutId.value, date: Date.now(), weights: weights, sets: sets});
            await queryDatabase(`UPDATE exercises SET data='${JSON.stringify(data)}' WHERE id=${e.id}`);
        }
    }

    await queryDatabase(`DELETE FROM currentWorkout`);
    await router.push('/workout');
}

const cancelWorkout = async () => {
    await queryDatabase(`DELETE FROM currentWorkout`);
    await router.push('/workout');
}

const addSet = (item, warmUp) => {
    item.sets.push({reps: 12, weight: 0, active: false, isPr: false, isWarmUp: warmUp})
};

</script>

<template>
    <div class="container">
        <p class="title">{{ workoutName }}</p>
        <p class="timer" v-if="!editMode">{{ timeString }}</p>

        <div class="space"></div>

        <Excercise class="exc-container" v-for="item in workoutExercises" :excercise-title="item.name" :excercise-data="item.sets" :edit-mode="editMode" @add-set="(v) => addSet(item, v)"/>
        
        <div class="control-panel">
            <RouterLink class="add-excercise button-style" :to="`/workout/${workoutId}/search`">+</RouterLink>
            <div class="workout-stop-panel">
                <div class="button-style" @click="cancelWorkout">x</div>
                <div class="button-style" @click="finishWorkout">o</div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.container {
    position: absolute;
    top: 0;
    left:0;
    width: 100vw;
    overflow: hidden;
}

.title {
    font-size: 40px;
    text-align: left;
    margin: 3.5rem 0 0 1rem;
}

.timer {
    font-size: 24px;
    color: #a0a0a0;
    text-align: left;
    margin: 0 0 0rem 1rem;
}

.space {
    margin-bottom:  6rem;
}

.exc-container {
    margin: 1rem 1rem 3rem 1rem;
}

.control-panel {
    margin: 0 1rem;
    display: grid; 
    grid-template-rows: auto auto;
    gap: 0.5rem;
}

.workout-stop-panel {
    display: grid; 
    grid-template-columns: auto auto;
    gap: 0.5rem;
}

.button-style {
    background-color: rgba(225, 225, 225, 0.071);
    border-radius: 2px;
    border: 1px #eee solid;
    text-align: center;
    text-decoration: none;
    color: #eee;
    font-size: 24px;
}

</style>