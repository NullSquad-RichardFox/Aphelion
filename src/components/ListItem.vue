<script setup>
import { Icon } from '@iconify/vue';
import { ref, onMounted, useTemplateRef, onUnmounted } from 'vue'
import { createGesture } from '@ionic/vue'
import { clamp } from '../utils/math'

const props = defineProps({
    enableGesture: Boolean,
    translationY: Number,
    maxDisplacement: Array,
    icons: { type: Array, default: () => ['tabler:error-404', 'tabler:error-404'] }
});

const emit = defineEmits(['swipeLeft', 'swipeRight']);

const swipeTranslate = ref(0);
const containerHandle = useTemplateRef('container');
let horizontalGesture = null;

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
    horizontalGesture = createGesture({
        el: containerHandle.value,
        threshold: 10,
        direction: 'x',
        disableScroll: true,
        gesturePriority: 10,
        gestureName: "horizontal-swipe-list-item",
        onMove: (e) => horizontalSwipeMove(e),
        onEnd: (e) => horizontalSwipeEnd(e)
    });

    horizontalGesture.enable(props.enableGesture);
})

onUnmounted(() => {
    horizontalGesture.destroy();
})

</script>

<template> 

<div ref="container" :style="{transform:`translate(${swipeTranslate}px, ${props.translationY}px)`, alignItems: 'center'}"> 
    <slot />
    <Icon v-if="props.maxDisplacement[0] !== 0 && swipeTranslate >= (props.maxDisplacement[0] - 5)" class="side-widget" :icon="props.icons[0]" height="80%" width="38" :style="{transform:`translateX(${-swipeTranslate}px)`}" />
    <Icon v-if="props.maxDisplacement[1] !== 0 && swipeTranslate <= (-props.maxDisplacement[1] + 5)" class="side-widget" :icon="props.icons[1]" height="80%" width="38" style="right: 0;" :style="{transform:`translateX(${-swipeTranslate}px)`}" />
</div>

</template>

<style scoped>

.side-widget {
    position: absolute;
}

</style>