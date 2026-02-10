<script setup>
import {ref} from 'vue'
import Planet from './Planet.vue';

const starSize = ref(100);
const planetSize = ref('3.5em');
const rotationSpeed = ref(1);

const angle = 136;
const posX = ref(50 - Math.cos(angle / 180 * Math.PI) * 50);
const posY = ref(50 - Math.sin(angle / 180 * Math.PI) * 50);

const imgSrc = (name) => {computed(() => {
    return new URL(`../assets/${name}`, import.meta.url).href
})}

</script>

<template>
    <div class="container">
        <div class="fats">
            <Planet :orbit-time="36.5" :color="[0, 0, 255, 0.1]" :progress="0.5"  :anim-delay="1"/>
        </div>
        <div class="carbs">
            <Planet :orbit-time="48.7" :color="[0, 235, 0, 0.1]" :progress="0.5"  :anim-delay="3"/>
        </div>
        <div class="protein">
            <Planet :orbit-time="68.7" :color="[220, 0, 0, 0.1]" :progress="0.5" :anim-delay="5"/>
        </div>
        <div class="star"></div>
    </div>
</template>

<style scoped>

.container {
    font-size: 6px;
    width: 100vw;
    height: 110vw;
    position: absolute;
    left: 0;
    top: 25%;
    overflow: hidden;
}

.star {
    position: absolute;
    background-color: yellow;
    border-radius: 50%;
    width: v-bind(starSize+'px');
    aspect-ratio: 1;
    top: calc(52.5% - v-bind(starSize/2+'px'));
    left: calc(50% - v-bind(starSize/2+'px'));
}

.protein, .carbs, .fats {
    position: absolute;
    border-style: solid;
    border-color: white transparent transparent transparent;
    border-width: 0.1em 0.1em 0 0;
    border-radius: 50%;
}

.protein {
    top: 32%;
    left: 27%;
    width: 46%;
    aspect-ratio: 1;
    animation: orbit calc(68.7s / v-bind(rotationSpeed)) linear infinite;
}

.carbs {
    top: 20%;
    left: 15%;
    width: 70%;
    aspect-ratio: 1;
    animation: orbit calc(48.7s / v-bind(rotationSpeed)) linear infinite;
}

.fats {
    top: 8%;
    left: 3%;
    width: 94%;
    aspect-ratio: 1;
    animation: orbit calc(36.5s / v-bind(rotationSpeed)) linear infinite;   
}

@keyframes orbit {
    to {
        transform: rotate(360deg);
    }
}

</style>