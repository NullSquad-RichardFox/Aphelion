<script setup>
import CircularButton from './CircularButton.vue';

import { ref } from "vue"
import { useRouter } from 'vue-router';

const router = useRouter();
const profileDataCategories = ref([
    {ref: "", icon: ""}, 
    {ref: "", icon: "gym_progress.png"}, 
    {ref: "", icon: "weight_progress.png"}, 
    {ref: () => { router.push('/settings') }, icon: "settings.png"}
]);
const profileExpanded = ref(false);

</script>

<template>
    <div class="profile">
        <CircularButton :size="50" icon="user.png" @click="profileExpanded = !profileExpanded"/>
        <div :class="['profile-button', {'button-enabled': profileExpanded}]" v-for="item in profileDataCategories">
            <CircularButton :size="40" :icon="item.icon" @click="item.ref"/>
        </div>
    </div>
</template>

<style scoped>
.profile {
    width: 50px;
    justify-content: center;
    position: absolute;
    top: 3.5rem;
    right: 20px;
}

.profile-button {
    visibility: collapse;
    margin: 10px 5px;
    display: flex;
}

.button-enabled {
    visibility: visible;
}

</style>