<script setup>
import Footer from './components/Footer.vue'
import Profile from './components/Profile/Profile.vue';
import WorkoutActive from './layouts/workout/WorkoutActive.vue';
import WorkoutMenu from './layouts/workout/WorkoutMenu.vue';

import { ref } from 'vue';

const currentDisplay = ref(1);
const workoutActive = ref(false);
const activeWorkoutName = ref('');
const activeWorkoutData = ref(new Map());

const openWorkout = (name, exc, sets) => {
    workoutActive.value = true;
    activeWorkoutName.value = name;

    for (let i = 0; i < exc.length; i++)
    {
        activeWorkoutData.value.set(exc[i], sets[i]);
    }
};

</script>

<template>
    
    <WorkoutActive v-if="currentDisplay == 1 && workoutActive" :title="activeWorkoutName" :data="activeWorkoutData" @close="workoutActive = false"/>
    <WorkoutMenu v-if="currentDisplay == 1 && !workoutActive" @open-workout="openWorkout"/>
    
    <Profile/>
    <Footer/>
    
</template>

<style scoped> 

</style>
