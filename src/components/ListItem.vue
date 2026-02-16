<script setup>
import { ref, onMounted, useTemplateRef } from 'vue'
import { createGesture } from '@ionic/vue'
import { clamp } from '../utils/math'
import { imageFromSrc } from '../utils/conversion';

const props = defineProps({
    enableGesture: Boolean,
    tranlationY: Number,
    maxDisplacement: Number,
    icons: Array
});

const emit = defineEmits(['swipeLeft', 'swipeRight']);


const swipeTranslate = ref(0);
const containerHandle = useTemplateRef('container');

onMounted(() => {
    const horizontalSwipeMove = (e) => {
        swipeTranslate.value = clamp(e.deltaX, -props.maxDisplacement, props.maxDisplacement);
    };

    const horizontalSwipeEnd = (e) => {
        if (swipeTranslate.value == props.maxDisplacement) {
            emit('swipeRight');
        } else if (swipeTranslate.value == -props.maxDisplacement) {
            emit('swipeLeft');
        }
        
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
        
    <div class="icon" v-for="(icon, index) in props.icons" :style="[index % 2 ? 'left:0' : 'right:0']" v-if="(index == 0 && swipeTranslate == props.maxDisplacement) || (index == 1 && swipeTranslate == -props.maxDisplacement)">
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