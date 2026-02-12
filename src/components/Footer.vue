<script setup>
import { ref } from "vue"

const emit = defineEmits(['cardio', 'gym', 'diet']);

const activeId = ref(1)

const cardioClick = () => {
    activeId.value = 0;
    emit('cardio');
};

const gymClick = () => {
    activeId.value = 1;
    emit('gym');
};

const dietClick = () => {
    activeId.value = 2;
    emit('diet');
};

</script>

<template>
    <div class="footer">
        <div class="holder">
            <div class="footer-element" :class="[activeId == 0 ? 'active' : 'in-active']" @click="cardioClick">
                <img src="../assets/cardio.png" alt="">
            </div>
            <div class="footer-element" :class="[activeId == 1 ? 'active' : 'in-active']" @click="gymClick">
                <img src="../assets/gym.png" alt="">
            </div>
            <div class="footer-element" :class="[activeId == 2 ? 'active' : 'in-active']" @click="dietClick">
                <img src="../assets/diet.png" alt="">
            </div>
        </div>
    </div>
</template>

<style scoped>

.footer {
    position: absolute;
    width: 100vw;
    left: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.7) 60%, rgba(0,0,0,1));
    backdrop-filter: blur(4px);
    overflow: hidden;
}

.holder {
    display: flex;
    justify-content: space-between;
    margin: 0 2.5rem;
}

.holder::after {
    content: '';
    position: absolute;
    width: 90vw;
    height: 2px;
    top: 0%;
    left: 5vw;
    background-color: #eee;
    border-radius: 2px;
}

.footer-element {
    margin-top: 10px;
    margin-bottom: 5px;
}
.footer-element img {
    width: 60px;
    aspect-ratio: 1;
}

.active {
    filter: invert(76%) sepia(72%) saturate(614%) hue-rotate(348deg) brightness(94%) contrast(92%);
}

.in-active {
    filter: invert(99%) sepia(6%) saturate(25%) hue-rotate(239deg) brightness(109%) contrast(87%)
}

</style>