<script setup>
import { ref, onMounted, useTemplateRef } from 'vue'
import { createGesture } from '@ionic/vue'
import { clamp, imageFromSrc } from '../../scripts/utilities.js'

const props = defineProps({
    enableGesture: Boolean,
    tranlationY: Number,
    maxDisplacement: Number,
    icons: Array
});

const emit = defineEmits(['left', 'right']);


const swipeTranslate = ref(0);
const containerHandle = useTemplateRef('container');

onMounted(() => {
    const horizontalSwipeMove = (e) => {
        swipeTranslate.value = clamp(e.deltaX, -props.maxDisplacement, props.maxDisplacement);
    };

    const horizontalSwipeEnd = (e) => {
        swipeTranslate.value = 0;
    };

    const horizontalGesture = createGesture({
        el: containerHandle.value,
        threshold: 10,
        direction: 'x',
        gestureName: "horizontal-swipe",
        onMove: (e) => horizontalSwipeMove(e),
        onEnd: (e) => horizontalSwipeEnd(e)
    });

    horizontalGesture.enable(props.enableGesture);
})

</script>

<template> 

<div ref="container" :style="{'transform':'translate(' + swipeTranslate + 'px,' + props.tranlationY + 'px)'}"> 
    <slot />
        
    <div class="icon" v-for="(icon, index) in props.icons" :style="[index % 2 ? 'left:0' : 'right:0']">
        <img :src="imageFromSrc(icon)" alt="">
    </div>
</div>

</template>

<style scoped>

.icon {
    position: absolute;
    transform: translateX(0);
    height: 100%;
}

.icon img {
    height: 100%;
}

</style>