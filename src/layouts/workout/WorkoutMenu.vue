<script setup>
import { onMounted, ref, useTemplateRef } from 'vue'
import { createGesture } from '@ionic/vue'
import { readFile } from '../../scripts/filesystem.js';

const emit = defineEmits(['openWorkout']);

const data = ref([]);
const openNewWorkout = ref(false);
const showAddWorkout = ref(false);
const workoutName = ref('');
const addGestureHandle = useTemplateRef('vec');
const addAnimTranslate = ref(0);

onMounted(() => {
    readFile('workoutTemplates.txt').then((v) => {
        if (v != null ) {
            data.value = Array();
        }

        showAddWorkout.value = data.value.length == 0;
    });

    const gesture = createGesture({
        el: addGestureHandle.value,
        threshold: 0,
        gestureName: 'add-el-drag',
        onMove: (e) => onMove(e)
    });

    const onMove = (e) => {
        addAnimTranslate.value = Math.max(-42, Math.min(0, addAnimTranslate.value + e.deltaY));
        if (addAnimTranslate.value == -42) {            
            showAddWorkout.value = true;
        }
    };

    gesture.enable(true);
});

const workoutPicked = (id) => {
    emit('openWorkout', data.value[id].name, data.value[id].excercises, data.value[id].sets);
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
        <div class="all-workouts" ref="vec">
            <div class="workout-item" v-for="(item, index) in data" @click="workoutPicked(index)" :style="{'transform': 'translateY(' + addAnimTranslate + 'px)'}">
                <p>{{ item.name }}</p>
                <img src="../../assets/editIcon.png" alt="" class="workout-edit">
            </div>
            <div v-if="showAddWorkout" class="workout-item centered" @click="openNewWorkout = true">
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
    color: #eee;
    text-align: left;
    margin: 2rem 0 5rem 1rem;
}

.section-title {
    font-size: 24px;
    color: #eeeeee;
    text-align: left;
    margin: 2rem 0 0.3rem 1rem;
}

.quick-access-workout {
    display: grid;
    align-items: center;
    margin: 0 1rem;
    background-color: #8e8e8e11;
    height: 80px;
    border: 2px #eee solid;
    border-radius: 2px;
}

.quick-access-workout p {
    font-size: 24px;
    color: #eee;
    margin-top: 1.1rem;
}

.all-workouts {
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
}

.workout-item p {
    margin: 0.2rem 0.5rem;
    font-size: 24px;
}

.workout-edit {
    margin: 0.2rem;
    width: 36px;
    height: 36px;
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