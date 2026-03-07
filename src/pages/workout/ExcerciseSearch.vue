<script setup>
import ScrollBox from '../../components/ScrollBox.vue';
import ControlPanel from '../../components/Control Panel.vue';
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { queryDatabase } from '../../utils/database'

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

onMounted(async () => {
    const res = await queryDatabase(`SELECT * FROM exercises`)
    allExcercises.value = res.values;
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

        <ControlPanel :expanded="false" margin="0.5rem 10%" :icons="['tabler:letter-x', 'tabler:plus']" :callbacks="[goBack, () => router.push(`/workout/${route.params.id}/creator`)]" />
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

</style>