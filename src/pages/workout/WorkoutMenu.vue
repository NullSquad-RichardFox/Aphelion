<script setup>
import ListItem from '../../components/workout/ListItem.vue';

import { onMounted, ref, useTemplateRef } from 'vue'
import { createGesture } from '@ionic/vue';
import { readFile } from '../../scripts/filesystem.js';
import { clamp } from '../../scripts/utilities.js'

const data = ref([]);
const openNewWorkout = ref(false);
const showAddWorkout = ref(false);
const workoutName = ref('');
const allWorkoutsTranslation = ref(0);
const allWorkoutsHandle = useTemplateRef('allWorkoutsRef');

onMounted(() => {
    readFile('workoutTemplates.txt').then((v) => {
        if (v == null || v == '') {
            data.value = [];
        } else if (Array.isArray(v)) {
            data.value = v;
        } else {
            data.value = Array(v);
        }

        showAddWorkout.value = data.value.length == 0;
    });

    const verticalSwipeStart = (e) => {

    };

    const verticalSwipeMove = (e) => {
        allWorkoutsTranslation.value = clamp(e.deltaY, -50, 0);
    };

    const verticalSwipeEnd = (e) => {
        if (allWorkoutsTranslation.value <= -50) {
            openNewWorkout.value = true;
        }

        allWorkoutsTranslation.value = 0;
    };

    const gesture = createGesture({
        el: allWorkoutsHandle.value,
        threshold: 10,
        direction: 'y',
        gestureName: 'vertical-swipe',
        onStart: (e) => verticalSwipeStart(e),
        onMove: (e) => verticalSwipeMove(e),
        onEnd: (e) => verticalSwipeEnd(e)
    });

    gesture.enable(true);
});

const workoutPicked = (id) => {
    emit('openWorkout', data.value[id].name, data.value[id].excercises, data.value[id].sets);
    
    const router = useRouter();
    router.push('/workout'); // idk how to pass the params
};

const createWorkout = () => {
    if (workoutName.value == '')
    {
        return;
    }

    openNewWorkout.value = false;
    emit('openWorkout', workoutName.value, [], []);
};

</script>

<template>
<div class="container">
    <p class="title">Workouts</p>
    
    <div v-if="data.length != 0">
        <p class="section-title">Next Workout</p>
        <div class="quick-access-workout" @click="workoutPicked(0)">
            <p>{{ data[0].name }}</p>
        </div>
    </div>

    <div>
        <p class="section-title">My Workouts</p>
        <div class="all-workouts" ref="allWorkoutsRef">
            <ListItem class="workout-item" v-for="(item, index) in data" @click="workoutPicked(index)" :tranlation-y="allWorkoutsTranslation" :enable-gesture="true" :max-displacement="50" :icons="['diet.png', 'gym.png']">
                <p>{{ item.name }}</p>
                <img src="../../assets/editIcon.png" alt="" class="workout-edit">
            </ListItem>
            <div v-if="showAddWorkout" class="workout-item centered" @click="openNewWorkout = true">
                <p>+</p>
            </div>
            <div v-if="allWorkoutsTranslation <= -42" class="workout-item phantom centered" :style="{'transform':'translateY(' + allWorkoutsTranslation + 'px)'}">
                <p>+</p>
            </div>
        </div>
    </div>

    <div class="create-workout-window" v-if="openNewWorkout">
        <input type="text" v-model="workoutName" placeholder="Workout Title" class="workout-name-input">
        <div class="confirm-panel">
            <div class="button-style" @click="createWorkout">o</div>
            <div class="button-style" @click="openNewWorkout = false">x</div>
        </div>
    </div>
</div>
</template>

<style scoped>

.container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
}

.title {
    font-size: 40px;
    text-align: left;
    margin: 3.5rem 0 5rem 1rem;
}

.section-title {
    font-size: 24px;
    text-align: left;
    margin: 2rem 0 0.3rem 1rem;
}

.quick-access-workout {
    display: grid;
    align-items: center;
    text-align: center;
    margin: 0 1rem;
    background-color: #8e8e8e11;
    height: 80px;
    border: 2px #eee solid;
    border-radius: 2px;
}

.quick-access-workout p {
    font-size: 24px;
    margin-top: 1.1rem;
}

.all-workouts {
    position: relative;
    margin: 0 1rem;
    background-color: #8e8e8e11;
    border-radius: 2px;
    padding: 0.2rem;
    overflow: hidden;
}

.workout-item {
    display: flex;
    justify-content: space-between;
    background-color: #80808029;
    border-radius: 4px;
    margin: 0.8rem 0.5rem;
    height: 3rem;
}

.workout-item p {
    margin: 0.2rem 0.5rem;
    font-size: 24px;
}

.phantom {
    position: absolute;
    width: calc(100% - 1.4rem);
    margin-top: 0;
}

.workout-edit {
    margin: 0.2rem;
    height: calc(100% - 0.4rem);
    filter: invert(99%) sepia(6%) saturate(25%) hue-rotate(239deg) brightness(109%) contrast(87%);
}

.centered {
    justify-content: center;
}

.create-workout-window {
    position: absolute;
    top: 40vh;
    left: 0.5rem;
    width: calc(100vw - 1.3rem);
    background-color: #272727;
    border: 2px #eee solid;
}

.workout-name-input {
    width: 90%;
    margin: 0.5rem 0rem;
}

.confirm-panel {
    margin: 0 1rem 0.5rem 1rem;
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