<script setup>
import { ref } from "vue"

const emit = defineEmits(['cardio', 'gym', 'diet']);

const activeId = ref(0)
const haloPos = ref(-3.5)

const elementClicked = (id) => {
    activeId.value = id;
    haloPos.value = -3.5 + id * 33.5;
    console.log(activeId);
}

const cardioClick = () => {
    activeId.value = 0;
    haloPos.value = -3.5;
    emit('cardio');
};

const gymClick = () => {
    activeId.value = 1;
    haloPos.value = 30;
    emit('gym');
};

const dietClick = () => {
    activeId.value = 2;
    haloPos.value = 63.5;
    emit('diet');
};

</script>

<template>
    <div class="footer">
        <div class="halo"></div>
        <div class="footer-element" :class="[activeId == 0 ? 'active' : 'in-active']" @click="cardioClick">
            <img src="../assets/cardio.png" alt="">
        </div>
        <div class="footer-element" :class="[activeId == 1 ? 'active' : 'in-active']" @click="gymClick">
            <img src="../assets/gym.png" alt="">
        </div>
        <div class="footer-element" :class="[activeId == 2 ? 'active' : 'in-active']" @click="dietClick">
            <img src="../assets/diet.png" alt="">
        </div>
    </div>
</template>

<style scoped>

.footer {
    position: absolute;
    width: 100vw;
    left: 0;
    bottom: 0;
    display: grid;
    grid-template-columns: auto auto auto;
    background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.7) 60%, rgba(0,0,0,1));
    backdrop-filter: blur(4px);
    z-index: 0;
    overflow: hidden;
}

.halo {
    width: 40%;
    height: 30%;
    position: absolute;
    bottom: -15%;
    left: v-bind(haloPos+'%'); /* -3.5 30 56.5*/
    background: radial-gradient(rgba(230, 182, 23, 0.8) 0%, rgba(0, 0, 0, 0) 70%);
    z-index: 1;
}

.footer-element {
    margin-top: 10px;
    margin-left: 1.66vw;
    margin-right: 1.66vw;
    margin-bottom: 5px;
    width: 30vw;
    z-index: 2;
}

.footer-element::after {
    content: '';
    position: absolute;
    width: 90vw;
    height: 2px;
    top: 0%;
    left: 5vw;
    background-color: #eee;
    border-radius: 2px;
}

.footer-element img {
    width: 40px;
    aspect-ratio: 1;
    
}

.footer-element p {
    font-size: 0.7rem;
    margin: 0 0 5px 0;
}

.active img {
    filter: invert(76%) sepia(72%) saturate(614%) hue-rotate(348deg) brightness(94%) contrast(92%);
}

.active p {
    color: #E6B617;
}

.in-active img {
    filter: invert(99%) sepia(6%) saturate(25%) hue-rotate(239deg) brightness(109%) contrast(87%)
}

.in-active p {
    color: #eee;
}

</style>