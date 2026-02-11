<script setup>
import CircularButton from '../../components/CircularButton.vue';
import Settings from './Settings.vue'

import {ref} from "vue"

const profileDataCategories = ref([
    {ref: "", icon: ""}, 
    {ref: "", icon: "gym_progress.png"}, 
    {ref: "", icon: "weight_progress.png"}, 
    {ref: () => { settingVisible.value = true }, icon: "settings.png"}
]);
const profileExpanded = ref(false);
const settingVisible = ref(false);

const profileClicked = () => {
    profileExpanded.value = !profileExpanded.value;
};

</script>

<template>
    <div class="profile">
        <CircularButton :size="50" icon="user.png" @click="profileClicked"/>
        <div :class="['profile-button', {'button-enabled': profileExpanded}]" v-for="item in profileDataCategories">
            <CircularButton :size="40" :icon="item.icon" @click="item.ref"/>
        </div>
    </div>

    <Settings v-if="settingVisible" v-model="settingVisible"/>
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