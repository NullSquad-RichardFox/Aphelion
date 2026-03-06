<script setup>
import { ref, onMounted, useTemplateRef } from 'vue'
import { createGesture } from '@ionic/vue'
import { clamp } from '../utils/math'

const props = defineProps({
    enableGesture: Boolean,
    translationY: Number,
    maxDisplacement: Array
});

const emit = defineEmits(['swipeLeft', 'swipeRight']);

const swipeTranslate = ref(0);
const containerHandle = useTemplateRef('container');

const horizontalSwipeMove = (e) => {
    swipeTranslate.value = clamp(e.deltaX, -props.maxDisplacement[1], props.maxDisplacement[0]);
};

const horizontalSwipeEnd = (e) => {
    if (swipeTranslate.value == props.maxDisplacement[0]) {
        emit('swipeRight');
    } else if (swipeTranslate.value == -props.maxDisplacement[1]) {
        emit('swipeLeft');
    }
    
    swipeTranslate.value = 0;
};

onMounted(() => {
    const horizontalGesture = createGesture({
        el: containerHandle.value,
        threshold: 10,
        direction: 'x',
        gestureName: "horizontal-swipe-list-item",
        onMove: (e) => horizontalSwipeMove(e),
        onEnd: (e) => horizontalSwipeEnd(e)
    });

    horizontalGesture.enable(props.enableGesture);
})

</script>

<template> 

<div ref="container" :style="{transform:`translate(${swipeTranslate}px, ${props.translationY}px)`}"> 
    <slot />
    <div class="side-widget" :style="{width:`${swipeTranslate}px`, transform:`translateX(${-swipeTranslate}px)`}"></div>
    <div class="side-widget" style="right: 0;" :style="{width:`${-swipeTranslate}px`, transform:`translateX(${-swipeTranslate}px)`}"></div>
</div>

</template>

<style scoped>

.side-widget {
    position: absolute;
    background: red;
    height: 100%;
}

</style>