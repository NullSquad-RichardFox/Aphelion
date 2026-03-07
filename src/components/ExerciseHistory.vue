<script setup>
import ListItem from './ListItem.vue'
import { Icon } from '@iconify/vue';
import { ref, watch } from 'vue';
import { queryDatabase } from '../utils/database';

const model = defineModel();
const props = defineProps({
    id: Number
})

const exerciseHistory = ref([]);
const exerciseName = ref('')

const showExerciseHistory = async (id) => {
    exerciseHistory.value = [];
    const res = (await queryDatabase(`SELECT * FROM exercises WHERE id=${id}`)).values[0];
    exerciseName.value = res.name;
    let data = JSON.parse(res.data);
    data = data.sort((a, b) => { return ((a['date'] < b['date']) ? -1 : ((a['date'] > b['date']) ? 1 : 0))})

    for (const d of data) {
        let sets = [];
        for (let i = 0; i < d.weights.length; i++) {
            sets.push({reps: d.reps[i], weight: d.weights[i]})
        }
        exerciseHistory.value.push({date: `${d.date.getDate()}.${d.date.getMonth() + 1}. ${d.date.getFullYear()}`, data: sets})
    }
}

watch(props, () => {
    showExerciseHistory(props.id)
})

</script>

<template>

<div v-if="model" class="container">
    <div class="header">
        <p class="exercise-name">{{ exerciseName }}</p>
        <div @click="model = false" class="close-icon">
            <Icon icon="tabler:letter-x" width="30" height="30" style="margin: 1.5rem 0.5rem 0 0;"/>
        </div>
    </div>
    <div v-for="item in exerciseHistory">
        <p class="text title">{{ item.date }}</p>
        <ListItem class="set" v-for="(set, index) in item.data" :enable-gesture="false" :translation-y="0" :max-displacement="[0, 0]" :icons="['', '']">
            <p class="text">{{  index + 1 }}</p>
            <p class="text">{{ set.reps }} reps</p>
            <p class="text">{{ set.weight }}kg</p>
        </ListItem>
    </div>
</div>

</template>

<style scoped>
.container {
    height: fit-content; 
    max-height: 650px;
    overflow-y: auto;
    scrollbar-width: none;
    background-color: #2d2d2d;
}

.header {
    display: flex;
    justify-content: space-between;
}

.exercise-name {
    font-size: 24px;
    margin: 1.5rem 1rem;
}

.close-icon {
    height: fit-content; 
    padding: 0.5rem;
}

.set {
    display: flex; 
    justify-content: space-between; 
    width: 100%;
}

.title {
    margin-top: 1.3rem !important;
}

.text {
    font-size: 18px;
    color: #eee;

    margin: 0.2rem 1rem;
}

</style>