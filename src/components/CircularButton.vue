<script setup>
    import {computed, onMounted} from 'vue'
    import { imageFromSrc } from '../utils/conversion';

    const props = defineProps({
        icon: String,
        size: Number
    })

    const clickFn = () => {
        console.log(props.icon);
    }
</script>

<template>
    <div class="circle" @click="clickFn">
        <img :src='imageFromSrc(props.icon)' alt="">
    </div>
</template>

<style scoped>
.circle {
    width: v-bind(size+"px");
    height: v-bind(size+"px");
    border-radius: 50%;
    background-color: white;
}

.circle img {
    width: v-bind(size+'px');
    aspect-ratio: 1;
}
</style>