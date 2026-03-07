<script setup>
import ListItem from '../../components/ListItem.vue';
import ControlPanel from '../../components/Control Panel.vue';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import { onMounted, ref, useTemplateRef } from 'vue';
import { createGesture } from '@ionic/vue';
import { clamp } from '../../utils/math';
import { queryDatabase } from '../../utils/database';

const userWorkouts = ref([]);
const openNewWorkout = ref(false);
const workoutName = ref('');

// Gestures
const allWorkoutsTranslation = ref(0);
const allWorkoutsHandle = useTemplateRef('allWorkoutsRef');

const router = useRouter();

const verticalSwipeStart = (e) => {

};

const verticalSwipeMove = (e) => {
    allWorkoutsTranslation.value = clamp(e.deltaY, -50, 0);
};

const verticalSwipeEnd = (e) => {
    if (allWorkoutsTranslation.value <= -50) {
        openNewWorkout.value = true;
    }

    allWorkoutsTranslation.value = 0;
};

onMounted(() => {
    queryDatabase('SELECT * FROM workoutTemplates').then((res) => {
        userWorkouts.value = res.values;
    });

    const gesture = createGesture({
        el: allWorkoutsHandle.value,
        threshold: 10,
        direction: 'y',
        gestureName: 'vertical-swipe',
        onStart: (e) => verticalSwipeStart(e),
        onMove: (e) => verticalSwipeMove(e),
        onEnd: (e) => verticalSwipeEnd(e)
    });

    gesture.enable(true);
});

const createWorkout = () => {
    if (workoutName.value == '') return;

    openNewWorkout.value = false;
    router.push({ path: `/workout/${workoutName.value}`, state: { editMode: true }});
};

const workoutPicked = (id) => {
    router.push({ path: `/workout/${id}`, state: { editMode: false }});
}

const removeWorkout = async (item) => {
    const id = userWorkouts.value.indexOf(item);
    await queryDatabase(`DELETE FROM workoutTemplates WHERE id=${userWorkouts.value[id].id}`);
    userWorkouts.value.splice(id, 1);
}

const editWorkout = (id) => {
    router.push({ path: `/workout/${id}`, state: { editMode: true }});
}

</script>

<template>
<div class="container">
    <p class="title">Workouts</p>
    
    <div v-if="userWorkouts.length !== 0">
        <p class="section-title">Next Workout</p>
        <div class="quick-access-workout" @click="workoutPicked(userWorkouts[0].id)">
            <p>{{ userWorkouts[0].name }}</p>
        </div>
    </div>

    <div>
        <p class="section-title">My Workouts</p>
        <div class="all-workouts" ref="allWorkoutsRef">
            <ListItem class="workout-item" v-for="item in userWorkouts" @click="workoutPicked(item.id)" :translation-y="allWorkoutsTranslation" :enable-gesture="true" :max-displacement="[50,50]" :icons="['tabler:trash', 'tabler:pencil']" @swipe-right="removeWorkout(item)" @swipe-left="editWorkout(item.id)">
                <p>{{ item.name }}</p>
            </ListItem>

            <div v-if="userWorkouts.length === 0" class="workout-item centered" @click="openNewWorkout = true">
                <Icon icon="tabler:circle-plus" width="35" color="#eee"/>
            </div>

            <div v-if="allWorkoutsTranslation <= -42" class="add-workout centered" :style="{'transform':'translateY(' + allWorkoutsTranslation + 'px)'}">
                <Icon icon="tabler:circle-plus" width="35" color="#eee"/>
            </div>
        </div>
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
    justify-content: space-between;
    height: 3rem;

    margin: 0.8rem 0.5rem;

    background-color: #80808029;
    border-radius: 4px;
}

.workout-item p {
    margin: 0.2rem 0.5rem;
    font-size: 24px;
}

.add-workout {
    display: flex;
    justify-content: space-between;
    height: 3rem;

    border-radius: 4px;

    margin: -0.2rem 0.5rem 0.8rem 0.5rem;
    position: absolute;
    width: calc(100% - 1.4rem);
}

.centered {
    justify-content: center;
    align-items: center;
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