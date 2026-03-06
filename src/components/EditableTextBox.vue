<script setup>
const model = defineModel();
const props = defineProps({
    auxiliaryText: String,
    type: String
})

const setText = (e) => {
    if (props.type.toLowerCase().trim() === 'number') {
        model.value = Number(e.target.innerText.trim());
    } else {
        model.value = e.target.innerText.trim();
    }
}

</script>

<template>
<p>
    <span role="textbox" contenteditable="true" @focusout="setText">
        {{ model }}
    </span>
    {{ props.auxiliaryText }}
</p>
</template>

<style scoped>

</style>