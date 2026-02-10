<script setup>
    import { useTemplateRef } from 'vue'
    import { createGesture } from '@ionic/vue'
    import { clamp } from '../scripts/Utilities.js'

    const props = defineProps({
        excerciseTitle: String,
        excerciseData: Array,
        editMode: Boolean
    });

    const emit = defineEmits(['addSet']);

    const frameTranslate = ref(0);
    const containerTranslate = ref(0);
    const headerHandle = useTemplateRef('header');
    const containerHandle = useTemplateRef('container');

    const swipeGestureStart = (e) => {
        swipeGestureContainer.enable(false);
    };

    const swipeGestureMove = (e) => {
        frameTranslate.value = clamp(frameTranslate.value + e.deltaX, -15, 15);
    };

    const swipeGestureEnd = (e) => {
        if (e.deltaX >= 15) {
            // remove
        } else if (e.deltaX <= -15) {
            // switch
        }

        // return anim
        frameTranslate.value = 0;

        swipeGestureContainer.enable(true);
    };

    const holdGestureMove = (e) => {

    };

    const holdGestureEnd = (e) => {

    };

    const swipeContainerStart = (e) => {
        swipeGesture.enable(false);
    };

    const swipeContainerMove = (e) => {
        containerTranslate.value = clamp(containerTranslate.value + e.deltaY, -30, 30);
    };

    const swipeContainerEnd = (e) => {
        if (e.deltaY >= 30) {
            emit('addSet', true);
        } else if (e.deltaY <= -30) {
            emit('addSet', false);
        } 

        // return anim
        containerTranslate.value = 0;

        swipeGesture.enable(true);
    };

    onMounted(() => {
        const swipeGesture = createGesture({
            el: headerHandle.value,
            threshold: 2,
            direction: 'x',
            gestureName: 'swipe-excercise',
            onStart: (e) => swipeGestureStart(e),
            onMove: (e) => swipeGestureMove(e),
            onEnd: (e) => swipeGestureEnd(e)
        });

        const holdGesture = createGesture({
            el: headerHandle.value,
            threshold: 0,
            gestureName: 'hold-excercise',
            onMove: (e) => holdGestureMove(e),
            onEnd: (e) => holdGestureEnd(e)
        });

        swipeGesture.enable(true);
        holdGesture.enable(true);

        const swipeGestureContainer = createGesture({
            el: containerHandle.value,
            threshold: 2,
            direction: 'y',
            gestureName: 'swipe-gesture-container',
            onStart: (e) => swipeContainerStart(e),
            onMove: (e) => swipeContainerMove(e),
            onEnd: (e) => swipeContainerEnd(e)
        });

        swipeGestureContainer.enable(true);
    });

</script>

<template>
    <div class="frame" :style="{'transform': 'translateX(' + frameTranslate + 'px);'}">
        <div class="head" ref="header">
            <p class="title">{{ props.excerciseTitle }}</p>
            <img src="../assets/editIcon.png" alt="" class="edit-icon">
        </div>

        <div class="container" v-for="(item, index) in props.excerciseData" ref="container">
            <div class="set" :class="{active: item.active}" :style="[item.isPr ? 'border-color: #E6B617' : 'border-color: #eee', 'transfomr': 'translateY(' + containerTranslate + 'px);']">
                <p>{{ index + 1}}</p>
                <p>{{ item.reps }} reps</p>
                <p v-if="!editMode">{{item.weight}}kg</p>
            </div>
        </div>

        <div class="container" v-if="props.excerciseData.length == 0">
            <div class="add" @click="emit('addSet')">
                <p>+</p>
            </div>
        </div>
    </div>
</template>

<style scoped> 
.frame {
    margin: 0 2em;
    padding: 0;
    border: 1px #eeeeee solid;
    border-radius: 4px;
    background-color: rgba(225, 225, 225, 0.071);
}

.head {
    display: flex;
    justify-content: space-between;
    margin: 0.5rem;
}

.title {
    text-align: left;
    font-size: 25px;
    margin: 0;
    color: #eeeeee;
}

.edit-icon {
    width: 37.5px;    
    height: 37.5px;
    filter: invert(99%) sepia(6%) saturate(25%) hue-rotate(239deg) brightness(109%) contrast(87%);
}

.container {
    margin: 0.5rem;
}

.set {
    display: flex;
    justify-content: space-between;
    border-radius: 1px;
    background-color: rgba(225, 225, 225, 0.071);
}

.active {
    border: 1px #eeeeee solid;
}

.set p {
    margin: 0.2rem;
    font-size: 18px;
    color: #eeeeee;
}

.add {
    border-radius: 1px;
    background-color: rgba(225, 225, 225, 0.071);
}

.add p {
    margin: 0.2rem;
    font-size: 18px;
    color: #eeeeee;
}

</style>