<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { queryDatabase } from '../../utils/database'

const router = useRouter();
const route = useRoute();

// get all excercises
const allExcercises = ref();
const searchBarText = ref('');

const goBack = () => {
    router.push(`/workout/${route.params.id}`);
}

const fulfillsSearch = () => {
    //name.startsWith(searchBarText.value);
    return true;
}

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
        <div class="results">
            <div class="excercise" v-for="item in allExcercises" @click="exercisePicked(item.id)">
                <p>{{ item.name }}</p>
            </div>
        </div>
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
    background-color: #202020;
}

.search-bar {
    width: 80vw;
    margin-top: 5rem;
}

.results {
    margin-left: 10%;
    margin-top: 1rem;
    width: 80%;
    height: 500px;
    background-color: rgba(73, 73, 73, 0.336);
    overflow: hidden;
}

.excercise {
    text-align: left;
    border-radius: 2px;
    margin: 0 0.25rem;
    background-color: #6868688e;
}

.excercise p {
    margin-left: 0.2rem;
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
}

</style>