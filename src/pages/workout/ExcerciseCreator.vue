<script setup>
import ControlPanel from '../../components/Control Panel.vue';
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

    <ControlPanel :expanded="false" margin="0.5rem 10%" :icons="['tabler:letter-x', 'tabler:check']" :callbacks="[goBack, createExcercise]" />
</div>

</template>

<style scoped>
.container {
    position: fixed;
    inset: 0;
    background-color: #1b1b1b;
}

.search-bar {
    display: block;
    width: 20rem;
    background: none;

    padding: 0.1rem;
    margin: 5rem auto 0 auto;
    
    border-radius: 4px;
    border: 1px solid #eee;
    
    font-size: 20px;
    color: #eee;
}

.menu {
    display: grid;
    width: 80%;
    gap: 0.6rem;
    margin: 0.5rem 0 0 10%;
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

.primary {
    border: 1px #eee solid;
}

.secondary {
    border: 1px #808080 solid;
}

</style>