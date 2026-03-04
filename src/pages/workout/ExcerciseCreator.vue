<script setup>

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { queryDatabase } from '../../utils/database';

const router = useRouter();
const excName = ref('');
const muscleParts = ref([
    {name: 'Biceps', active: 0},
    {name: 'Triceps', active: 0},
    {name: 'Front delts', active: 0},
    {name: 'Mid delts', active: 0},
    {name: 'Rear delts', active: 0},
    {name: 'Pecs', active: 0},
    {name: 'Abs', active: 0},
    {name: 'Trapezoids', active: 0},
    {name: 'Lats', active: 0},
    {name: 'Glutes', active: 0},
    {name: 'Quads', active: 0},
    {name: 'Hamstrings', active: 0},
    {name: 'Calfs', active: 0}
]);

const createExcercise = async () => {
    if (excName.value == '') {
        return;
    }

    let primaryMuscles = [];
    let secondaryMuscles = [];
    for (const {name, active} of muscleParts.value) {
        if (active === 1) {
            primaryMuscles.push(name);
        } else if (active === 2) {
            secondaryMuscles.push(name);
        }
    }

    if (primaryMuscles.length == 0) {
        return;
    }

    await queryDatabase(`INSERT INTO exercises (name, musclesPrimary, musclesSecondary, data) VALUES (?,?,?,?)`, [excName.value, JSON.stringify(primaryMuscles), JSON.stringify(secondaryMuscles), JSON.stringify([])]);

    router.go(-1);
};

const goBack = () => {
    router.go(-1);
}
</script>

<template>

<div class="container">
    <input type="text" placeholder="Excercise Name" v-model="excName" class="search-bar">
    <div class="menu">
        <div class="item" v-for="item in muscleParts" @click="item.active = (item.active + 1) % 3" :class="{primary: item.active === 1, secondary: item.active === 2}">
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
    background-color: #1b1b1b;
}

.search-bar {
    display: block;
    width: 20rem;
    margin: 5rem auto 0 auto;
    background: none;
    border: 1px solid #eee;
    padding: 0.1rem;
    border-radius: 4px;
    color: #eee;
    font-size: 20px;
}

.menu {
    margin: 0.5rem 0 0 10%;
    width: 80%;
    display: grid;
    gap: 0.6rem;
}

.item {
    background-color: rgba(37, 37, 37, 0.76);
    border-radius: 3px;
    padding: 0.1rem;
}

.item p {
    padding: 0; 
    margin:0;
    text-align: center;
    font-size: 18px;
}

.control-panel {
    display: grid;
    grid-template-columns: auto auto;
    margin: 0.8rem 10% 0.5rem 10%;
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

.primary {
    border: 1px #eee solid;
}

.secondary {
    border: 1px #808080 solid;
}

</style>