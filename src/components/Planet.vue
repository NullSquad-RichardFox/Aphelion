<script setup>
import {ref} from 'vue'

const props = defineProps({
    color: Array,
    orbitTime: Number,
    progress: Number
})

const planetSize = ref('3.5em');
const progressPer = ref(props.progress);
const fresnelColor = ref('rgb(' + props.color[0] + ',' + props.color[1] + ',' + props.color[2] + ')');
const fresnelColorA = ref('rgba(' + props.color[0] + ',' + props.color[1] + ',' + props.color[2] + ',' + props.color[3] + ')');

</script>

<template>
    <img src="../assets/barren_planet.png" class="planet">
    <div class="fresnel"></div>
    <div class="progress f1"></div>
    <div class="progress f2"></div>
    <div class="progress f3"></div>
</template>

<style scoped>

.planet {
    position: absolute;
    width: calc(2 * v-bind(planetSize));
    aspect-ratio: 1;
    top: calc(14.644660940672622% - v-bind(planetSize));
    left: calc(85.35533905932738% - v-bind(planetSize));
    border-radius: 50%;
    animation: anti-orbit v-bind(orbitTime + 's') linear infinite;
    filter: brightness(70%) grayscale(100%);
}

.fresnel {
    position: absolute;
    width: calc(2 * v-bind(planetSize) - 5px);
    aspect-ratio: 1;
    top: calc(15.267081477050127% - v-bind(planetSize));
    left: calc(85.96699001693256% - v-bind(planetSize));
    border-radius: 50%;
    transform:rotate(225deg);
    background: radial-gradient(transparent 70%, v-bind(fresnelColor)), linear-gradient(v-bind(fresnelColorA) 5%, transparent);
}

.progress {
    position: absolute;
    width: calc(2 * v-bind(planetSize) - 5px);
    aspect-ratio: 1;
    top: calc(15.267081477050127% - v-bind(planetSize));
    left: calc(85.96699001693256% - v-bind(planetSize));
    border-radius: 50%;
    background: linear-gradient(to top, v-bind(fresnelColor) v-bind(progressPer * 100 + '%'), transparent v-bind(progressPer * 100 + '%'));
    animation: anti-orbit v-bind(orbitTime + 's') linear infinite;
}

.f1 {
    filter:blur(25px) opacity(100%);
}

.f2 {
    filter:blur(10px);
    animation-name: flicker;
    animation-duration: 5s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
}

.f3 {
    filter:blur(5px) opacity(50%);
}

@keyframes anti-orbit {
    to {
        transform: rotate(-360deg);
    }
    
}

@keyframes flicker {
    0%, 100% {
        filter: opacity(50%);
    }
    50% {
        filter: opacity(15%);
    }
}

</style>