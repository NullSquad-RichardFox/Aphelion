import { createWebHistory, createRouter } from 'vue-router'

import HomeMenu from '../pages/HomeMenu.vue'
import WorkoutMenu from '../pages/workout/WorkoutMenu.vue'
import WorkoutActive from '../pages/workout/WorkoutActive.vue'
import ExerciseCreator from '../pages/workout/ExcerciseCreator.vue'
import ExerciseSearch from '../pages/workout/ExcerciseSearch.vue'
import Settings from '../pages/Settings.vue'


const routes = [
    { path: '/', component: HomeMenu },
    { path: '/workout', component: WorkoutMenu },
    { path: '/workout/:id', component: WorkoutActive },
    { path: '/workout/search', component: ExerciseSearch },    
    { path: '/workout/creator', component: ExerciseCreator },
    { path: '/settings', component: Settings}
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;