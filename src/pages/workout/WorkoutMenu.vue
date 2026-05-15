<script setup>
import ListItem from '../../components/ListItem.vue';
import InteractiveList from '../../components/InteractiveList.vue';
import ControlPanel from '../../components/Control Panel.vue';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import { onMounted, ref, useTemplateRef } from 'vue';
import { createGesture } from '@ionic/vue';
import { clamp } from '../../utils/math';
import { queryDatabase } from '../../utils/database';

const router = useRouter();

// Refs
const userWorkouts = ref([]);
const featuredWorkoutID = ref(0);
const workoutUnfinished = ref(false);

// New workout menu
const openNewWorkout = ref(false);
const workoutName = ref('');

onMounted(async () => {
    const res = await queryDatabase('SELECT * FROM workoutTemplates');
    userWorkouts.value = res.values;

    const currentWorkout = (await queryDatabase(`SELECT * FROM currentWorkout`)).values;
    if (currentWorkout.length !== 0) {
        workoutUnfinished.value = true;
        featuredWorkoutID.value = () => { };
        for (let i = 0; i < userWorkouts.value.length; i++) { 
            if (userWorkouts.value[i].id === currentWorkout[0].id) {
                featuredWorkoutID.value = i;
                break; 
            }
        }
    }
});

const createWorkout = () => {
    if (workoutName.value == '') return;

    openNewWorkout.value = false;
    router.push({ path: `/workout/${workoutName.value}`, state: { editMode: true }});
};

const workoutPicked = (workout, index) => {
    router.push({ path: `/workout/${workout.id}`, state: { editMode: false }});
}

const removeWorkout = async (workout, index) => {
    await queryDatabase(`DELETE FROM workoutTemplates WHERE id=${workout.id}`);
    userWorkouts.value.splice(index, 1);
}

const editWorkout = (workout, index) => {
    router.push({ path: `/workout/${workout.id}`, state: { editMode: true }});
}

</script>

<template>
<div class="container">
    <p class="title">Workouts</p>
    
    <div v-if="userWorkouts.length !== 0">
        <p class="section-title">{{workoutUnfinished ? 'Resume Workout' : 'Next Workout'}}</p>
        <div class="quick-access-workout" @click="workoutPicked(userWorkouts[featuredWorkoutID].id)">
            <p>{{ userWorkouts[featuredWorkoutID].name }}</p>
        </div>
    </div>

    <div>
        <p class="section-title">My Workouts</p>
        <InteractiveList class="all-workouts"
            :list="userWorkouts" 
            :icon-size="35" 
            :max-swipe-up="42"
            :max-swipe-down="0"
            @swipe-up="openNewWorkout = true"
            v-slot="{ translationY }"
        >
            <ListItem class="workout-item"     
                v-for="(item, index) in userWorkouts"
                @click="workoutPicked(item, index)"
                @swipe-left="editWorkout(item, index)"
                @swipe-right="removeWorkout(item, index)"
                :enable-gesture="true" 
                :max-displacement="[50, 50]"
                :icons="['tabler:trash', 'tabler:pencil']"
                :translation-y="translationY" 
            >
                <p class="workout-inner">{{item.name}}</p>
            </ListItem>
        </InteractiveList>
    </div>

    <div class="create-workout-window" v-if="openNewWorkout">
        <input type="text" v-model="workoutName" placeholder="Workout Name" class="workout-name-input">
        <ControlPanel :expanded="false" margin="0 0.75rem 0.5rem 0.75rem" :icons="['tabler:letter-x', 'tabler:check']" :callbacks="[() => {openNewWorkout = false}, createWorkout]" />
    </div>
</div>
</template>

<style scoped>

.container {
    position: fixed;
    inset: 0;
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
    height: 80px;
    background-color: #8e8e8e11;
    
    margin: 0 1rem;

    border: 2px #eee solid;
    border-radius: 2px;
}

.quick-access-workout p {
    font-size: 24px;
    margin-top: 1.1rem;
}

.all-workouts {
    position: relative;
    height: auto;
    max-height: 420px;
    
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: none;
    
    margin: 0 1rem;
    padding: 0.2rem;
    
    border-radius: 2px;
    background-color: #8e8e8e11;
}

.workout-item {
    display: flex;
    height: 3rem;
    
    margin: 0.8rem 0.5rem;
    
    background-color: #80808029;
    border-radius: 4px;
    
    justify-content: space-between;
}

.workout-inner {
    margin: 0.2rem 0.5rem;
    font-size: 24px;
}

.create-workout-window {
    position: absolute;
    top: 40vh;
    left: 1.5rem;
    width: calc(100vw - 3.3rem);
    background-color: #272727;
    border: 2px #eee solid;
}

.workout-name-input {
    display: block;
    width: calc(100% - 1.5rem);
    background: none;

    margin: 0.8rem auto 0.5rem auto;
    padding: 0.1rem;
    
    border: 1px solid #eee;
    border-radius: 4px;
    
    color: #eee;
    font-size: 20px;
}

</style>