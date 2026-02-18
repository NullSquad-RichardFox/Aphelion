<script setup>
import Excercise from '../../components/Excercise.vue';

import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { queryDatabase } from '../../utils/database';
import { isNumeric } from '../../utils/conversion';

const route = useRoute();
const router = useRouter();

// Defines

const editMode = ref(true);

const workoutName = ref('');
const workoutExercises = ref(); // {id, name, sets: {reps: 12, weight: 0, active: false, isPr: false, isWarmUp: warmUp}}

const timerVal = ref(0);
let intervalId = null;

const timeString = computed(() => {
    const hours = Math.floor(timerVal.value / 3600);
    const mins = Math.floor(timerVal.value / 60) - hours * 60;
    const secs = timerVal.value % 60;
    return hours == 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
});

const addExercise = async (id) => {
    console.log(id);
    const res = await queryDatabase(`SELECT * FROM exercises WHERE id=${id}`);
    workoutExercises.push({id: id, name: res.values[0].name, sets: []});
}

const loadWorkoutData = async () => {
    const exists = await queryDatabase(`SELECT EXISTS(SELECT 1 FROM currentWorkout WHERE id=${route.params.id});`)
    console.log(exists);

    if (exists) {
        // this might not be nescessary if exists already contains the values
        const current = await queryDatabase(`SELECT * FROM currentWorkout WHERE id=${route.params.id}`).values[0];
        
        workoutName.value = current.name;
        timerVal.value = current.timer;
        editMode.value = current.editMode;
        
        // set workoutExercises 
    }
    else {
        let exercises = [];
        let sets = [];

        if (!isNumeric(route.params.id)) {
            // new workout
            workoutName.value = route.params.id;
            editMode.value = true;
        } else {            
            // old workout
            const res = await queryDatabase(`SELECT * FROM workoutTemplates WHERE id=${route.params.id}`);
            const workout = res.values[0];
            workoutName.value = workout.name;
            sets = JSON.parse(workout.set);
            exercises = JSON.parse(workout.exercises);
            editMode.value = history.state.editMode;

            // set workoutExercises;
        }

        await queryDatabase(`INSERT INTO currentWorkout (id, name, timer, editMode, exercises, setsTotal)`, [
            isNumeric(route.params.id) ? route.params.id : -1,
            workoutName.value,
            timerVal.value,
            editMode.value,
            JSON.stringify(exercises),
            JSON.stringify(sets)
        ]);

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

    let exercises = [];
    let setsTotal = [];
    let setsActive = [];
    let weights = [];

    for (const e in workoutExercises.value) {
        exercises.push(e.id);
        setsTotal.push(e.sets.length);

        let active = 0;
        for (const s in e.sets) {
            weights.push(s.weight);
            if (s.active) active++;
        }

        setsActive.push(active);
    }

    queryDatabase(`UPDATE currentWorkout SET 
        timer=${timerVal.value}, 
        exercises=${JSON.stringify(exercises)}, 
        setsTotal=${JSON.stringify(setsTotal)}, 
        setsWorked=${JSON.stringify(setsActive)}, 
        weights=${JSON.stringify(weights)} 
    WHERE id=${isNumeric(route.params.id) ? route.params.id : -1}`);
});

const finishWorkout = async () => {
    if (editMode.value) {
        // Update existing workout
        if (isNumeric(route.params.id)) {
            let exs = [];
            let sets = [];
            
            for (const exercise of workoutExercises.value) {
                exs.push(exercise.id);
                sets.push(exercise.sets.length);
            }

            await queryDatabase(`UPDATE workoutTemplates SET name=${workoutName.value}, exercises=${JSON.stringify(exs)}, sets=${JSON.stringify(sets)} WHERE id=${route.params.id}`);
        }

        // Add new workout 
        else {
            await queryDatabase(`INSERT INTO workoutTemplates (name, exercises, sets) VALUES (?,?,?);`, [
                workoutName.value, 
                JSON.stringify(workoutExercises.value), 
                JSON.stringify(workoutSets.value)
            ]);
        }
    } else {
        // Store workout data
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
            
            data.push({workout: route.params.id, date: Date.now(), weights: weights, sets: sets});
            await queryDatabase(`UPDATE exercises SET data=${JSON.stringify(data)} WHERE id=${e.id}`);
        }
    }

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
            <RouterLink class="add-excercise button-style" :to="`/workout/${route.params.id}/search`">+</RouterLink>
            <div class="workout-stop-panel">
                <RouterLink class="button-style" to="/workout">x</RouterLink>
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
}

.add-excercise {
    margin-bottom: 0.5rem;
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
}

</style>