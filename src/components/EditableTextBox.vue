<script setup>
import { ref, inject } from 'vue';

const model = defineModel();
const props = defineProps({
    auxiliaryText: String,
    type: String
})

const inputRef = ref();
const keyboardHandle = inject('numeric-keyboard')

const setText = (e) => {
    if (props.type?.toLowerCase().trim() === 'number') {
        model.value = Number(e.target.innerText.trim());
    } else {
        model.value = e.target.innerText.trim();
    }

    const selection = window.getSelection();
    selection.removeAllRanges();
}

function onValueChanged() {
    console.log('textbox')
}

const selectAll = () => {
    const range = document.createRange();
    range.selectNodeContents(inputRef.value);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    keyboardHandle.keyboardModel.value = model;
    keyboardHandle.keyboardVisible.value = true;
}

</script>

<template>
<p>
    <span ref="inputRef" role="textbox" contenteditable="true" @focusout="setText" @click.stop="selectAll()">
        {{ model }}
    </span>
    {{ props.auxiliaryText }}
</p>
</template>

<style scoped>
span {
    padding: 5px;
}
</style>