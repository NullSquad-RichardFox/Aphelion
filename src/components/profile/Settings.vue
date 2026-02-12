<script setup>
import { ref, onMounted } from 'vue'
import { getAllFiles, writeFile } from '../../scripts/filesystem.js'

const model = defineModel();

const rootDirFiles = ref([]);
onMounted(() => {
    /*for (file of getAllFiles()) {
        rootDirFiles.push({path: file, selected: false});
    }*/

    writeFile('workoutTemplates.txt', '');
})
</script>

<template>

<div class="container">
    <div class="close-button" @click="model = false">x</div>
    <div class="list-files" v-for="file in rootDirFiles">
        <div class="file-list-item">
            <input type="checkbox" v-model="file.selected">
            <p>{{file.path}}</p>
        </div>
    </div>
</div>

</template>

<style scoped>
.container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
}

.file-list-item {
    display: flex;
    justify-content: space-between;
}

.close-button {
    p {
        font-size: 20px;
    }

    margin: 0.5rem;
}

</style> 