<script setup>
import { ref, useTemplateRef } from 'vue'
import { createGesture } from '@ionic/vue'

const emit = defineEmits(['remove']);

const containerHandle = useTemplateRef('container');

onMounted(() => {
    const removeGesture = createGesture({
        el: containerHandle.value,
        threshold: 0,
        gestureName: "remove-item",
        onMove,
        onEnd
    });

    const onMove = (e) => {
        // show remove anim
    };

    const onEnd = (e) => {
        if (e.deltaX >= 15) {
            emit('remove');
        }
    };

    removeGesture.enable(true);
})

</script>

<template> 

<div ref="container" class="list-item"> 
    <slot />
</div>

</template>

<style scoped>

.list-item {
    display: flex;
    justify-content: space-between;
}

</style>