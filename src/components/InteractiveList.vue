<script setup>
import ListItem from './ListItem.vue';
import { ref, onMounted, useTemplateRef } from 'vue';
import { createGesture } from '@ionic/vue';
import { Icon } from '@iconify/vue';
import { clamp } from '../utils/math';

const props = defineProps({
    list: Array,
    iconSize: Number,
    maxSwipeUp: Number,
    maxSwipeDown: Number
});

const emit = defineEmits(['swipeUp', 'swipeDown']);

const containerHandle = useTemplateRef('container')
const containerTranslate = ref(0);

const verticalSwipeMove = (e) => {
    containerTranslate.value = clamp(e.deltaY, -props.maxSwipeUp, props.maxSwipeDown);
}

const verticalSwipeEnd = (e) => {
    if (containerTranslate.value <= -props.maxSwipeUp) {
        emit('swipeUp');
    } else if (containerTranslate.value >= props.maxSwipeDown) {
        emit('swipeDown');
    }

    containerTranslate.value = 0;
}

onMounted(async () => {
    const verticalSwipe = createGesture({
        el: containerHandle.value,
        threshold: 10,
        direction: 'y',
        gestureName: 'list-container-swipe-vertical',
        onMove: (e) => verticalSwipeMove(e),
        onEnd: (e) => verticalSwipeEnd(e)
    });

    verticalSwipe.enable(true);

    console.log(props)
})

</script>

<template>

<div ref="container">
    <slot :translation-y="containerTranslate" />

    <div v-if="containerTranslate <= -props.maxSwipeUp && props.maxSwipeUp !== 0" class="list-icon" :style="{'transform':'translateY(' + containerTranslate + 'px)'}">
        <Icon icon="tabler:circle-plus" :width="props.iconSize" :height="props.iconSize" />
    </div>

    <div v-if="containerTranslate >= props.maxSwipeDown && props.maxSwipeDown !== 0" class="list-icon" style="top:0;">
        <Icon icon="tabler:circle-dashed-plus" :width="props.iconSize" :height="props.iconSize" />
    </div>
    
    <div v-if="props.list.length == 0" class="list-icon-alone" @click="emit('swipeUp')">
        <Icon icon="tabler:circle-plus" :width="props.iconSize" :height="props.iconSize" />
    </div>

</div>

</template>

<style scoped>

.list-icon {
    display: flex;
    height: 3rem;

    border-radius: 4px;

    margin: -0.2rem 0.5rem 0.8rem 0.5rem;
    position: absolute;
    width: calc(100% - 1.4rem);

    justify-content: center;
    align-items: center;
}

.list-icon-alone {
    display: flex;
    
    margin: 0.8rem 0.5rem;
    
    border-radius: 4px;
    
    justify-content: center;
    align-items: center;
}

</style>