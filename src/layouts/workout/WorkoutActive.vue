<script setup>
import Excercise from '../../components/workout/Excercise.vue';
import ExcerciseSearch from './ExcerciseSearch.vue';

import { ref, onMounted, onUnmounted, computed } from 'vue'
import { readFile, appendFile } from '../../scripts/filesystem';

const props = defineProps({
    title: {type: String, default: 'New Workout'},
    data: Map
});

const emit = defineEmits(['close', 'finish']);

// Defines
const allExcercises = ref(new Map());
const data = ref([]);

const editMode = ref(props.data.size == 0);
const showSearchMenu = ref(false);
const timerVal = ref(0);
let intervalId = null;

const timeString = computed(() => {
    const hours = Math.floor(timerVal.value / 3600);
    const mins = Math.floor(timerVal.value / 60) - hours * 60;
    const secs = timerVal.value % 60;
    return hours == 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
});

const initWorkout = () => {
    for (const item of props.data) {
        let sets = []
        for (let i = 0; i < item[1]; i++) {
            sets.push({reps: 12, weight: 0, active: false, isPr: false, isWarmUp: false});
        }
        
        if (allExcercises.value.has(item[0])) {
            data.value.push({excName: allExcercises.value.get(item[0]).name, excID: item[0], excSets: sets})
        } else {
            console.error('Excercise not present', item[0]);
        }
    }

    intervalId = setInterval(() => {
        timerVal.value++;
    }, 1000);
};

onMounted(() => {
    readFile('excercises.txt').then((file) => {
        allExcercises.value = new Map(file);

        if (!editMode.value) {
            initWorkout();
        }
    });
});

onUnmounted(() => {
    if (intervalId != null ) {
        clearInterval(intervalId);
    }
});

const finishWorkout = () => {
    if (editMode.value) {
        // stores workout template
        const workoutTemplate = {
            name: props.title,
            excercises: [],
            sets: []
        }

        for (let i = 0; i < data.value.length; i++) {
            workoutTemplate.excercises.push(data.value[i].excID);
            workoutTemplate.sets.push(data.value[i].excSets.length);
        }

        appendFile('workoutTemplates.txt', workoutTemplate);

    } else {
        // store workout data
    }

    emit('close');
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
        <p class="title">{{ props.title }}</p>
        <p class="timer" v-if="!editMode">{{ timeString }}</p>
        <div class="space"></div>
        <Excercise class="exc-container" v-for="item in data" :excercise-title="item.excName" :excercise-data="item.excSets" :edit-mode="editMode" @add-set="(v) => addSet(item, v)"/>
        <div class="control-panel">
            <div class="add-excercise button-style" @click="showSearchMenu = true">+</div>
            <div class="workout-stop-panel">
                <div class="button-style" @click="emit('close')">x</div>
                <div class="button-style" @click="finishWorkout">o</div>
            </div>
        </div>
    </div>
    <ExcerciseSearch v-if="showSearchMenu" @close="showSearchMenu = false" @picked="addExcercise"/>

</template>

<style scoped>

.container {
    position: absolute;
    top: 0;
    left:0;
    width: 100vw;
}

.title {
    font-size: 40px;
    color: #eee;
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