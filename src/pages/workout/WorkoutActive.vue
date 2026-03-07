<script setup>
import Exercise from '../../components/Exercise.vue';
import { Icon } from '@iconify/vue';
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { queryDatabase } from '../../utils/database';
import { isNumeric } from '../../utils/conversion';
import EditableTextBox from '../../components/EditableTextBox.vue';

const route = useRoute();
const router = useRouter();

let intervalId = null;
const timerVal = ref(0);
const editMode = ref(true);
const workoutId = ref(route.params.id);
const workoutName = ref('');
const workoutExercises = ref([]); // {id, name, sets: {reps: 12, weight: 0, active: false, isPr: false, isWarmUp: warmUp}}

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
    editMode.value = history.state.editMode === undefined ? Boolean(current.editMode) : history.state.editMode;
    workoutExercises.value = JSON.parse(current.exercises);
}

const createWorkout = async () => {
    if (!isNumeric(workoutId.value)) {
        // new workout
        workoutName.value = workoutId.value;
        editMode.value = true;
    } else {            
        // old workout
        const res = await queryDatabase(`SELECT * FROM workoutTemplates WHERE id=${workoutId.value}`);
        const workout = res.values[0];
        workoutName.value = workout.name;
        const sets = JSON.parse(workout.sets);
        const exercises = JSON.parse(workout.exercises);
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

    await queryDatabase(`INSERT INTO currentWorkout (id, name, timer, editMode, exercises) VALUES (?,?,?,?,?)`, [
        isNumeric(workoutId.value) ? workoutId.value : -1,
        workoutName.value,
        timerVal.value,
        Number(editMode.value),
        JSON.stringify(workoutExercises.value)
    ]);
}

const loadWorkoutData = async () => {   
    const exists = await queryDatabase(`SELECT EXISTS(SELECT 1 FROM currentWorkout WHERE id=${isNumeric(workoutId.value) ? workoutId.value : -1}) AS workoutExists;`)

    if (exists.values[0].workoutExists === 1) {
        await retrieveStoredWorkout();   
    }
    else {
        await createWorkout();
    } 
}

const storeTempWorkoutData = async () => {
    const res = await queryDatabase(`SELECT EXISTS(SELECT 1 FROM currentWorkout WHERE id=${isNumeric(workoutId.value) ? workoutId.value : -1}) AS workoutExists;`)
    if (res.values[0].workoutExists === 1) {
        await queryDatabase(`UPDATE currentWorkout SET 
            timer='${timerVal.value}', 
            exercises='${JSON.stringify(workoutExercises.value)}'
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
});

onBeforeRouteLeave(async () => {
    await storeTempWorkoutData();
})

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
            const res = (await queryDatabase(`SELECT * FROM exercises WHERE id=${e.id}`)).values[0];
            let data = JSON.parse(res.data);
            let weights = [];
            let sets = [];

            let orm = 0;
            for (const s of e.sets) {
                if (s.active && !s.isWarmUp) {
                    weights.push(s.weight);
                    sets.push(s.reps);

                    orm = Math.max(orm, s.weight * (1 + s.reps / 30));
                }
            }
            
            data.push({workout: workoutId.value, date: Date.now(), weights: weights, sets: sets});
            await queryDatabase(`UPDATE exercises SET data='${JSON.stringify(data)}', personalBest='${res.personalBest < orm ? orm : res.personalBest}' WHERE id=${e.id}`);
        }
    }

    await queryDatabase(`DELETE FROM currentWorkout`);
    await router.push('/workout');
}

const cancelWorkout = async () => {
    await queryDatabase(`DELETE FROM currentWorkout`);
    await router.push('/workout');
}

const openSearch = async () => {
    await storeTempWorkoutData();
    await router.push(`/workout/${workoutId.value}/search`);
}

const addSet = (item, warmUp) => {    
    if (warmUp) {
        item.sets.unshift({reps: 12, weight: 0, active: false, isPr: false, isWarmUp: true})
    } else {
        item.sets.push({reps: 12, weight: 0, active: false, isPr: false, isWarmUp: false})
    }

};

const removeExercise = (index) => {
    workoutExercises.value.splice(index, 1);
}

</script>

<template>
    <div class="container">
        <EditableTextBox v-if="editMode" class="title" v-model="workoutName"/>
        <p v-if="!editMode" class="title">{{ workoutName }}</p>
        <p class="timer" v-if="!editMode">{{ timeString }}</p>

        <div class="space"></div>

        <div class="exercise-box">
            <Exercise class="exercise" v-for="(item, index) in workoutExercises" :id="index" :excercise="item" :edit-mode="editMode" @add-set="(v) => addSet(item, v)" @remove-exercise="(v) => removeExercise(v)"/>
            
            <div class="control-panel">
                <div class="add-excercise button-style" @click="openSearch">
                    <Icon icon="tabler:plus" color="#eee" width="25"/>
                </div>
                <div class="workout-stop-panel">
                    <div class="button-style" @click="cancelWorkout">
                        <Icon icon="tabler:letter-x" color="#eee" width="25"/>
                    </div>
                    <div class="button-style" @click="finishWorkout">
                        <Icon icon="tabler:check" color="#eee" width="25"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.container {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
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

.exercise-box {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 90px;
    scrollbar-width: none;
}

.exercise {
    margin: 1rem 1rem 3rem 1rem;
}

.control-panel {
    position: sticky;
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
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: rgba(225, 225, 225, 0.071);
    border-radius: 2px;
    border: 1px #eee solid;

    padding: 0.2rem 0;
}

</style>