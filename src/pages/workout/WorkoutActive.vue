<script setup>
import Excercise from '../../components/Excercise.vue';

import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { queryDatabase } from '../../utils/database';
import { isNumeric } from '../../utils/conversion';

const route = useRoute();
const router = useRouter();

// Defines

const editMode = ref(history.state?.editMode != undefined);

const workoutName = ref('');
const workoutSets = ref([]);
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
    const res = await queryDatabase(`SELECT * FROM workoutTemplates WHERE id=${route.params.id}`);
    const workout = res.values[0];

    workoutName.value = workout.name;

    const exercises = await queryDatabase(`SELECT * FROM exercises WHERE id IN (${JSON.parse(workout.exercises).join(',')})`);
}

onMounted(() => {
    if (!editMode.value) {
        intervalId = setInterval(() => {
            timerVal.value++;
        }, 1000);
    }

    if (isNumeric(route.params.id)) {
        loadWorkoutData().then(() => {
            if (history.state?.exercise != undefined) addExercise(history.state.exercise);
        });
    } else {
        workoutName.value = route.params.id;
        if (history.state?.exercise != undefined) addExercise(history.state.exercise);
    }

});

onUnmounted(() => {
    if (intervalId != null ) {
        clearInterval(intervalId);
    }
});

const finishWorkout = async () => {
    if (editMode.value) {
        // Update existing workout
        if (isNumeric(route.params.id)) {
            let exs = [];
            let sets = [];
            
            for (const exercise of workoutExercises) {
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

    }

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