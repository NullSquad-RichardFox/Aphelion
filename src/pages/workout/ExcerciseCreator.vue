<script setup>

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { readFile, writeFile } from '../../utils/filesystem';

const router = useRouter();
const excName = ref('');
const muscleParts = ref([
    {name: 'Biceps', active: false},
    {name: 'Triceps', active: false},
    {name: 'Front delts', active: false},
    {name: 'Mid delts', active: false},
    {name: 'Rear delts', active: false},
    {name: 'Pecs', active: false},
    {name: 'Abs', active: false},
    {name: 'Trapezoids', active: false},
    {name: 'Lats', active: false},
    {name: 'Glutes', active: false},
    {name: 'Quads', active: false},
    {name: 'Hamstrings', active: false},
    {name: 'Calfs', active: false}
]);

const createExcercise = () => {
    if (excName.value == '') {
        return;
    }

    let activeMuscles = [];
    for (const {name, active} of muscleParts.value) {
        if (active) {
            activeMuscles.push(name)
        }
    }

    if (activeMuscles.length == 0) {
        return;
    }

    readFile('excercises.txt').then((f) => {
        const exercises = new Map(f);
        router.push('/workout/search');
    });
};

const goBack = () => {
    router.go(-1);
}
</script>

<template>

<div class="container">
    <input type="text" placeholder="Excercise Name" v-model="excName" class="exc-name-input">
    <div class="muscle-menu">
        <div class="button-style" v-for="item in muscleParts" @click="item.active = !item.active" :class="{active: item.active}">
            <p>{{ item.name }}</p>
        </div>
    </div>
    <div class="control-panel">
        <div class="button-style active" @click="goBack">x</div>
        <div class="button-style active" @click="createExcercise">o</div>
    </div>
</div>

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

.exc-name-input {
    margin-top: 5rem;
}

.muscle-menu {
    margin: 0.5rem 0 0 10%;
    width: 80%;
    display: grid;
    gap: 0.5rem;
}

.button-style {
    background-color: rgba(225, 225, 225, 0.071);
    border-radius: 2px;
}

.button-style p {
    margin: 0;
}

.active {
    border: 1px #eee solid;
}

.control-panel {
    display: grid;
    grid-template-columns: auto auto;
    margin: 0.5rem 10%;
    gap: 0.5rem;
}

</style>