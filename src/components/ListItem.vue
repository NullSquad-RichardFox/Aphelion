<script setup>
import { ref, onMounted, useTemplateRef, computed } from 'vue'
import { createGesture } from '@ionic/vue'
import { clamp } from '../utils/math'
import { imageFromSrc } from '../utils/conversion';

const props = defineProps({
    enableGesture: Boolean,
    tranlationY: Number,
    maxDisplacement: Number,
    leftIcon: String,
    rightIcon: String
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
        gestureName: "horizontal-swipe-list-item",
        onMove: (e) => horizontalSwipeMove(e),
        onEnd: (e) => horizontalSwipeEnd(e)
    });

    horizontalGesture.enable(props.enableGesture);
})

const hello = computed(() => {
    return {transform:`translateY(${props.tranlationY}px)`}
})

</script>

<template> 

<div ref="container" :style="hello"> 
    <slot />
        
    <img :src="imageFromSrc(props.leftIcon)" style="left:0" v-if="swipeTranslate == props.maxDisplacement" alt="">
    <img :src="imageFromSrc(props.rightIcon)" style="right:0" v-if="swipeTranslate == -props.maxDisplacement" alt="">
</div>

</template>

<style scoped>

.icon {
    position: absolute;
    height: 10px;
}

.icon img {
    height: 10px;
    width: 10px;
}

</style>