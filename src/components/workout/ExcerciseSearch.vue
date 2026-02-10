<script setup>
import {ref, onMounted, computed, onUnmounted} from 'vue'
import { ReadFile, WriteFile } from '../scripts/Filesystem';
import { uuid } from '../scripts/Utilities';

import ExcerciseCreator from './ExcerciseCreator.vue';

const emit = defineEmits(['close', 'picked']);

// get all excercises
const allExcercises = ref(new Map());
const searchBarText = ref('');
const showExcerciseCreator = ref(false);

const excerciseCreated = (title, muscles) => {
    allExcercises.value.set(uuid(), {name: title, musclesUsed: muscles, data: []});
    WriteFile('excercises.txt', JSON.stringify(Array.from(allExcercises.value.entries())));
};

onMounted(() => {
    ReadFile('excercises.txt').then((file) => {
        allExcercises.value = new Map(file);
    })
});

</script>

<template>
    <div class="container">
        <input class="search-bar" type="text" placeholder="Excercise Name" v-model="searchBarText">
        <div class="results">
            <div class="excercise" v-for="item in allExcercises" @click="emit('picked', item[0]), emit('close')">
                <p>{{ item[1].name }}</p>
            </div>
        </div>
        <div class="control-panel">
            <div class="button-style" @click="emit('close')">x</div>
            <div class="button-style" @click="showExcerciseCreator = true">+</div>
        </div>
    </div>
    
    <ExcerciseCreator v-if="showExcerciseCreator" @close="showExcerciseCreator = false" @add-excercise="excerciseCreated"/>
</template>

<style scoped>

.container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #202020;
}

.search-bar {
    width: 80vw;
    margin-top: 5rem;
}

.results {
    margin-left: 10%;
    margin-top: 1rem;
    width: 80%;
    height: 500px;
    background-color: rgba(73, 73, 73, 0.336);
    overflow: hidden;
}

.excercise {
    text-align: left;
    border-radius: 2px;
    margin: 0 0.25rem;
    background-color: #6868688e;
}

.excercise p {
    margin-left: 0.2rem;
}

.control-panel {
    display: grid;
    grid-template-columns: auto auto;
    margin: 0.5rem 10%;
    gap: 0.5rem;
}

.button-style {
    background-color: rgba(225, 225, 225, 0.071);
    border-radius: 2px;
    border: 1px #eee solid;
}

</style>