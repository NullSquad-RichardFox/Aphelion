import { createWebHistory, createRouter } from 'vue-router'

import WorkoutMenu from '../pages/workout/WorkoutMenu.vue'
import WorkoutActive from '../pages/workout/WorkoutActive.vue'
import ExerciseCreator from '../pages/workout/ExcerciseCreator.vue'
import ExerciseSearch from '../pages/workout/ExcerciseSearch.vue'

const routes = [
    { path: '/', component: WorkoutMenu },
    { path: '/workout', component: WorkoutActive },
    { path: '/workout/search', component: ExerciseSearch },    
    { path: '/workout/creator', component: ExerciseCreator },
]

export const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});