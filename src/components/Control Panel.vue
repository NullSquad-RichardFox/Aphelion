<script setup>
import { Icon } from '@iconify/vue';

const props = defineProps({
    icons: Array,
    callbacks: Array,
    expanded: Boolean,
    margin: String
})

</script>

<template>

<div v-if="props.expanded" class="control-panel-horizontal" style="position: sticky;" :style="{margin: props.margin}">
    <div class="button-style" @click="props.callbacks[0]">
        <Icon :icon="props.icons[0]" color="#eee" width="25"/>
    </div>

    <div class="control-panel-vertical">
        <div class="button-style" @click="props.callbacks[1]">
            <Icon :icon="props.icons[1]" color="#eee" width="25"/>
        </div>

        <div class="button-style" @click="props.callbacks[2]">
            <Icon :icon="props.icons[2]" color="#eee" width="25"/>
        </div>
    </div>
</div>

<div v-if="!props.expanded" class="control-panel-vertical" style="position: sticky;" :style="{margin: props.margin}">
    <div class="add-excercise button-style" @click="props.callbacks[0]">
        <Icon :icon="props.icons[0]" color="#eee" width="25"/>
    </div>

    <div class="button-style" @click="props.callbacks[1]">
        <Icon :icon="props.icons[1]" color="#eee" width="25"/>
    </div>
</div>

</template>

<style scoped>
.control-panel-horizontal {
    display: grid; 
    grid-template-rows: auto auto;
    gap: 0.5rem;
}

.control-panel-vertical {
    display: grid; 
    grid-template-columns: auto auto;
    gap: 0.5rem;
}

.button-style {
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: rgba(225, 225, 225, 0.071);
    border-radius: 2px;
    border: 1px #eee solid;

    padding: 0.2rem 0;
}
</style>