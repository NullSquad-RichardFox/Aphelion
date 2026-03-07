<script setup>
    import { Icon } from '@iconify/vue';
    
    const props = defineProps({
        icon: { type: String, default: 'tabler:error-404' },
        size: Number
    })
</script>

<template>
    <div class="circle" :style="{width: `${props.size}px`, height: `${props.size}px`}">
        <Icon :icon="props.icon" :width="props.size - 5" :height="props.size - 5" color="#eee" style="margin: 0;"/>
    </div>
</template>

<style scoped>
.circle {
    display: flex;
    align-items: center;
    justify-content: center;
    
    border-radius: 50%;
    border: 3px solid #eee;
}
</style>