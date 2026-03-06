<script setup>
import { ref, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router";
import { Icon } from "@iconify/vue";

const router = useRouter();
const route = useRoute();
const activeId = ref();

const workoutClick = () => {
    activeId.value = 0;
    router.push('/workout');
};

const homeClick = () => {
    activeId.value = 1;
    router.push('/');
};

const dietClick = () => {
    activeId.value = 2;
    //router.push('/diet');
};

onMounted(() => {
    if (route.path.includes('workout')) {
        activeId.value = 0;
    } else if (route.path.includes('diet')) {
        activeId.value = 2;
    } else {
        activeId.value = 1;
    }
});

</script>

<template>
    <div class="footer">
        <div class="holder">
            <Icon class="footer-element" width="64" :color="activeId == 0 ? '#FFB417' : '#eee'" icon="tabler:barbell" @click="workoutClick"/>
            <Icon class="footer-element" width="64" :color="activeId == 1 ? '#FFB417' : '#eee'" icon="tabler:home" @click="homeClick"/>
            <Icon class="footer-element" width="64" :color="activeId == 2 ? '#FFB417' : '#eee'" icon="tabler:cookie" @click="dietClick"/>
        </div>
    </div>
</template>

<style scoped>

.footer {
    position: absolute;
    width: 100vw;
    left: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.7) 60%, rgba(0,0,0,1));
    backdrop-filter: blur(4px);
    overflow: hidden;
}

.holder {
    display: flex;
    justify-content: space-between;
    margin: 0 2rem 0.6rem 2rem;
}

.holder::after {
    content: '';
    position: absolute;
    width: 90vw;
    height: 3px;
    top: 0%;
    left: 5vw;
    background-color: #eee;
    border-radius: 2px;
}

.footer-element {
    margin-top: 10px;
    margin-bottom: 5px;
}

</style>