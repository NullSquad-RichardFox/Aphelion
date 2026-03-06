<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>

<div class="container">
    <div class="close-button" @click="router.go(-1)">x</div>
</div>

</template>

<style scoped>
.container {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
}

.close-button {
    margin: 0.5rem;
    font-size: 40px;
}

.list {
    position: relative;
}
</style> 