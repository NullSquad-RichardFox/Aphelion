<script setup>
import { ref } from 'vue'
import { GetAllFiles } from '../scripts/filesystem.js'

const rootDirFiles = ref();

onMounted(() => {
    rootDirFiles.value = GetAllFiles();
})
</script>

<template>

<div class="container">
    <div class="list-files" v-for="file in rootDirFiles">
        <div class="file-list-item">
            <input type="check-box">
            <p>{{file}}</p>
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

.list-files {

}

.file-list-item {
    display: flex;
    justify-content: space-between;
}


</style> 