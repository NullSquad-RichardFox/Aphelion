<script setup>
import { ref, computed, onMounted, useTemplateRef } from 'vue'

const props = defineProps({
    items: Array,
    itemHeight: Number,
    containerHeight: Number,
    buffer: Number
})

const container = useTemplateRef('container')
const scrollTop = ref(0)

const totalHeight = computed(() =>
    props.items.length * props.itemHeight
)

const startIndex = computed(() =>
    Math.max(
        0,
        Math.floor(scrollTop.value / props.itemHeight) - props.buffer
    )
)

const visibleCount = computed(() =>
    Math.ceil(props.containerHeight / props.itemHeight) + props.buffer * 2
)

const endIndex = computed(() =>
    Math.min(
        props.items.length,
        startIndex.value + visibleCount.value
    )
)

const visibleItems = computed(() =>
    props.items.slice(startIndex.value, endIndex.value)
)

const offsetY = computed(() =>
    startIndex.value * props.itemHeight
)

function onScroll(e) {
    scrollTop.value = e.target.scrollTop
}

onMounted(() => {
    container.value.style.height = props.containerHeight + 'px'
})
</script>

<template>
<div ref="container" class="container" @scroll="onScroll">
    <div class="list" :style="{ transform: `translateY(${offsetY}px)` }">
        <div v-for="item in visibleItems" :key="item.id" class="item" :style="{ height: itemHeight + 'px' }">
            <slot :item="item" />
        </div>
    </div>
</div>
</template>

<style scoped>
.container {
  overflow-y: auto;
  position: relative;
}

.list {
  display: flex;
  flex-direction: column;
}

.item {
  box-sizing: border-box;
}
</style>