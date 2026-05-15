<script setup>
import { ref } from 'vue';
import InteractiveList from '../components/InteractiveList.vue';
import ListItem from '../components/ListItem.vue';

const suplements = ref([{name: 'Creatine', time: Date.now(), checkedToday: false}]);




</script>

<template>
<p class="title">Aphelion</p>

<div>
    <p>Suplements</p>
    <InteractiveList class="list-container"
        :list="suplements"
        :icon-size="25"
        :max-swipe-up="34"
        :max-swipe-down="0"
        @swipe-up=""
        v-slot="{ translationY }"    
    >
        <ListItem class="list-item"
            v-for="(item, index) in suplements"
            @click=""
            @swipe-right=""
            @swipe-left=""
            :enable-gesture="true" 
            :max-displacement="[40, 40]"
            :icons="['tabler:trash', 'tabler:pencil']"
            :translation-y="translationY" 
        >
            <input type="checkbox" v-model="item.checkedToday" @click="console.log(item)" />
            <p>{{ item.name }}</p>
        </ListItem>
    </InteractiveList>
</div>

<div>
    <p>Weight</p>
    <input type='text' placeholder="Add today's weight"/>
</div>

<div>
    <p>Sleep</p>
    <p>Set up integration with another platform</p>
</div>

</template>

<style scoped> 
.title {
    font-size: 40px;
    text-align: left;
    margin-top: 1.2rem;
}

.list-container {
    position: relative;
    margin: 0.5rem;
    margin-left: 1.5rem;
    overflow: hidden;
}

.list-item {
    display: flex;
    justify-content: space-between;
}

</style>