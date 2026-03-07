<script setup>
import ScrollBox from '../components/ScrollBox.vue'
import { useRouter } from 'vue-router';
import { createDatabase, dropDatabase, queryDatabase } from '../utils/database';
import { onMounted, ref } from 'vue';

const router = useRouter();
const currentWorkoutData = ref([]);
const workoutTemplatesData = ref([]);
const exercisesData = ref([]);

const loadData = async () => {
    currentWorkoutData.value = (await queryDatabase(`SELECT * FROM currentWorkout`))?.values;
    workoutTemplatesData.value = (await queryDatabase(`SELECT * FROM workoutTemplates`))?.values;
    exercisesData.value = (await queryDatabase(`SELECT * FROM exercises`))?.values;
}

const dropData = async () => {
    await dropDatabase();
    await createDatabase();
}

onMounted(() => {
    loadData();
})

</script>

<template>

<div class="container">
    <div class="close-button" @click="router.go(-1)">x</div>

    <p @click="dropData" style="font-size: 20px; border: 1px white solid; width: fit-content;">Drop Database</p>

    <p>Current Workout</p>
    <ScrollBox class="list" :items="currentWorkoutData" :buffer="5" :container-height="100" :item-height="20">
        <template #default="item">
            <p style="font-size: 15px;">{{ item }}</p>
        </template>
    </ScrollBox>

    <p>Workout Templates</p>
    <ScrollBox class="list" :items="workoutTemplatesData" :buffer="5" :container-height="200" :item-height="20">
        <template #default="item">
            <p style="font-size: 15px;">{{ item }}</p>
        </template>
    </ScrollBox>

    <p>Exercises</p>
    <ScrollBox class="list" :items="exercisesData" :buffer="5" :container-height="200" :item-height="250">
        <template #default="item">
            <p style="font-size: 15px;">{{ item }}</p>
        </template>
    </ScrollBox>
</div>

</template>

<style scoped>
.container {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
}

.close-button {
    margin: 3.5rem 0.5rem 0.5rem 0.5rem;
    font-size: 40px;
}

.list {
    position: relative;
    scrollbar-width: none;
}

</style> 