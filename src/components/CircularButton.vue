<script setup>
    import {computed, onMounted} from 'vue'

    const props = defineProps({
        icon: String,
        size: Number
    })

    const clickFn = () => {
        console.log(props.icon);
    }

    const imgSrc = computed(() => {
        return new URL(`../assets/${props.icon}`, import.meta.url).href
    })
</script>

<template>
    <div class="circle" @click="clickFn">
        <img :src='imgSrc' alt="">
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