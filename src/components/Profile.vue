<script setup>
import CircularButton from './CircularButton.vue';

import { ref } from "vue"
import { useRouter } from 'vue-router';

const router = useRouter();
const profileDataCategories = ref([
    {ref: () => {}, icon: ""}, 
    {ref: () => {}, icon: ""}, //tabler:scale-outline
    {ref: () => router.push('/gym-progress'), icon: "tabler:device-desktop-up"}, 
    {ref: () => router.push('/settings'), icon: "tabler:settings"}
]);
const profileExpanded = ref(false);

const handleClick = (fun) => {
    profileExpanded.value = false;
    fun();
}

</script>

<template>
    <div class="profile">
        <CircularButton :size="50" icon="tabler:user" @click="profileExpanded = !profileExpanded"/>
        <div class="profile-button" :style="{visibility: profileExpanded ? 'visible' : 'collapse'}" v-for="item in profileDataCategories">
            <CircularButton :size="40" :icon="item.icon" @click="handleClick(item.ref)"/>
        </div>
    </div>
</template>

<style scoped>
.profile {
    position: absolute;
    top: 3.5rem;
    right: 20px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 10px;
    width: 50px;
}

.profile-button {
    margin: 0;
    padding: 0;
}
</style>