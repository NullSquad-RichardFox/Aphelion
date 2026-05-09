<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { App } from "@capacitor/app"

const router = useRouter();
const version = ref();
const build = ref();

onMounted(async () => {
    const info = await App.getInfo();
    version.value = info.version;
    build.value = info.build;
})

</script>

<template>

<div class="container">
    <div class="close-button" @click="router.go(-1)">x</div>
    <p>Version: {{ version }}</p>
    <p>Build: {{ build }}</p>
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
    margin: 3.5rem 0.5rem 0.5rem 0.5rem;
    font-size: 40px;
}
</style> 