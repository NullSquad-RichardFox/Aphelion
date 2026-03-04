<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { queryDatabase } from '../../utils/database'

import ScrollBox from '../../components/ScrollBox.vue';

const router = useRouter();
const route = useRoute();

// get all excercises
const allExcercises = ref([]);
const searchBarText = ref('');

const goBack = () => {
    router.push(`/workout/${route.params.id}`);
}

const filteredItem = computed(() => {
    return searchBarText.value === '' ? allExcercises.value : allExcercises.value.filter(ex => ex.name.toLowerCase().includes(searchBarText.value.toLowerCase()))
})

const exercisePicked = (id) => {  
    router.push({ path: `/workout/${route.params.id}`, state: { exercise: id }});
}

onMounted(() => {
    queryDatabase(`SELECT * FROM exercises`).then((res) => {      
        allExcercises.value = res.values;
    });
});

</script>

<template>
    <div class="container">
        <input class="search-bar" type="text" placeholder="Excercise Name" v-model="searchBarText">
        
        <ScrollBox class="results" :items="filteredItem" :item-height="40" :buffer="5" :container-height="500">
            <template #default="{item}" class="item">
                <p class="item-text" @click="exercisePicked(item.id)">{{ item.name }}</p>
            </template>
        </ScrollBox>
        
        <div class="control-panel">
            <div class="button-style" @click="goBack">x</div>
            <RouterLink class="button-style" :to="`/workout/${route.params.id}/creator`">+</RouterLink>
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

.results {
    position: relative;
    margin-left: 10%;
    margin-top: 1rem;
    width: 80%;
    scrollbar-width: none;
    background-color: rgba(73, 73, 73, 0.336);
}

.item {
    padding: 0; 
    margin:0;
}

.item-text {
    padding: 0; 
    margin: 0 0.5rem; 
    line-height: 40px;
    font-size: 18px;
}

.control-panel {
    display: grid;
    grid-template-columns: auto auto;
    margin: 0.5rem 10%;
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

</style>