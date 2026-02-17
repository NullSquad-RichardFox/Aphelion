<script setup>
import Excercise from '../../components/Excercise.vue';

import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { loadDatabase, closeDatabase, querryDatabase } from '../../utils/database';
import { isNumeric } from '../../utils/conversion';
import { uuid } from '../../utils/math';

const route = useRoute();
const router = useRouter();

// Defines

const editMode = ref(!isNumeric(route.params.id));

const workoutName = ref('');
const workoutExerciseId = ref([]);
const workoutExerciseNames = ref([]);
const workoutSets = ref([]);
const workoutWeights = ref([]);

const workoutExercises = ref();

const timerVal = ref(0);
let intervalId = null;

const timeString = computed(() => {
    const hours = Math.floor(timerVal.value / 3600);
    const mins = Math.floor(timerVal.value / 60) - hours * 60;
    const secs = timerVal.value % 60;
    return hours == 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
});

onMounted(() => {
    if (!editMode.value) {
        // Set up timer
        intervalId = setInterval(() => {
            timerVal.value++;
        }, 1000);

        // Load workout data
        loadDatabase().then(() => {
            querryDatabase(`SELECT * FROM workoutTemplates WHERE id=${route.params.id}`).then((res) => {
                const workout = res.values[0];
                workoutName.value = workout.name;
                querryDatabase(`SELECT * FROM exercises`).then((exercises) => {
                    console.log(exercises.values);
                });
            });

        });
    } else {
        workoutName.value = route.params.id;
    }
});

onUnmounted(() => {
    if (intervalId != null ) {
        clearInterval(intervalId);
    }
});

const finishWorkout = () => {
    if (editMode.value) {
        loadDatabase().then(() => {
            console.log(workoutName.value);
            querryDatabase(`
                INSERT INTO workoutTemplates (id, name, exercises, sets) 
                VALUES (?,?,?,?);`, [uuid(), workoutName.value, JSON.stringify(workoutExercises.value), JSON.stringify(workoutSets.value)]
            ).then((v) => {
                console.log(v);
                router.push('/workout');
            })
        })

    } else {
        // store workout data
    }
}

const addExcercise = (id) => {
        readFile('excercises.txt').then((v) => {
        allExcercises.value = new Map(v);
        
        if (allExcercises.value.has(id)) {
            data.value.push({excName: allExcercises.value.get(id).name, excID: id, excSets: []});
        } else {
            console.error('Excercise not present', id);
        }
    });   
};

const addSet = (item, warmUp) => {
    item.excSets.push({reps: 12, weight: 0, active: false, isPr: false, isWarmUp: warmUp})
};

</script>

<template>
    <div class="container">
        <p class="title">{{ workoutName }}</p>
        <p class="timer" v-if="!editMode">{{ timeString }}</p>

        <div class="space"></div>

        <Excercise class="exc-container" v-for="item in workoutExercises" :excercise-title="item.excName" :excercise-data="item.excSets" :edit-mode="editMode" @add-set="(v) => addSet(item, v)"/>
        
        <div class="control-panel">
            <RouterLink class="add-excercise button-style" to="/workout/search">+</RouterLink>
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