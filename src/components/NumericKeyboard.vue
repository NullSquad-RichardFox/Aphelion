<script setup>
import { inject } from 'vue';
import { Icon } from '@iconify/vue';

const keyboardHandle = inject('numeric-keyboard');

const closeKeyboard = () => {
    console.log('close')
    keyboardHandle.keyboardVisible.value = false;
}

const addInput = (key) => {
    const kModel = keyboardHandle.keyboardModel.value;
    if (!kModel) return;

    let prevVal = String(kModel.value);
    prevVal += key;

    kModel.value = Number(prevVal);
    console.log(prevVal, kModel.value);
}

const removeLast = () => {
    const kModel = keyboardHandle.keyboardModel.value;
    if (!kModel) return;

    let prevVal = String(kModel.value);
    prevVal = prevVal.slice(0, -1);

    kModel.value = Number(prevVal);
    console.log(prevVal, kModel.value);
}

</script>

<template>
<div class="container" @click="closeKeyboard">
    <div class="keyboard" @click.stop>
        <div class="keyboard-row">
            <div class="button"></div>
            <div class="button"></div>
            <div class="button" @click.stop="closeKeyboard">Close</div>
        </div>
        <div class="keyboard-row">
            <div class="button highlight" @click.stop="addInput('1')">1</div>
            <div class="button highlight" @click.stop="addInput('2')">2</div>
            <div class="button highlight" @click.stop="addInput('3')">3</div>
        </div>
        <div class="keyboard-row">
            <div class="button highlight" @click.stop="addInput('4')">4</div>
            <div class="button highlight" @click.stop="addInput('5')">5</div>
            <div class="button highlight" @click.stop="addInput('6')">6</div>
        </div>
        <div class="keyboard-row">
            <div class="button highlight" @click.stop="addInput('7')">7</div>
            <div class="button highlight" @click.stop="addInput('8')">8</div>
            <div class="button highlight" @click.stop="addInput('9')">9</div>
        </div>
        <div class="keyboard-row">
            <div class="button highlight" @click.stop="addInput('.')">.</div>
            <div class="button highlight" @click.stop="addInput('0')">0</div>
            <div class="button highlight" @click.stop="removeLast"><Icon icon="tabler:backspace"/></div>
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
    height: 100vh;
}

.keyboard {
    position: fixed;
    bottom: 0;
    left: 0;

    display: grid;
    width: 100vw;

    padding-bottom: 1rem;

    background-color: rgb(23, 23, 23);
}

.keyboard::before {
    content: '';
    width: 100vw;
    height: 2px;

    background-color: rgb(143, 143, 143);
}

.keyboard-row {
    display: grid;
    gap: 0.4rem;
    grid-template-columns: auto auto auto;

    margin: 0.2rem auto;
}

.button {
    width: 30vw;
    text-align: center;

    user-select: none;
    touch-action: manipulation;

    font-size: 20px;
}

.highlight {
    border-radius: 4px;
    background-color: rgb(33, 33, 33);
}

</style>