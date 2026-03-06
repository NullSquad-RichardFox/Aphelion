<script setup>
    import ListItem from './ListItem.vue';
    import EditableTextBox from './EditableTextBox.vue';
    import { onMounted, useTemplateRef, ref, watch } from 'vue'
    import { createGesture } from '@ionic/vue';
    import { clamp } from '../utils/math';
    
    const props = defineProps({
        excerciseTitle: String,
        excerciseData: Array,
        editMode: Boolean,
        id: Number
    });

    const emit = defineEmits(['addSet', 'removeExercise']);

    const lastWarmUpIndex = ref(-1);
    const titleTranslate = ref(0);
    const containerTranslate = ref(0);
    const titleHandle = useTemplateRef('titleRef');
    const containerHandle = useTemplateRef('setContainer');

    const titleSwipeMove = (e) => {
        titleTranslate.value = clamp(e.deltaX, 0, 50);
    }

    const titleSwipeEnd = (e) => {
        if (titleTranslate.value >= 50) {
            emit('removeExercise', props.id)
        }

        titleTranslate.value = 0;
    }

    const containerSwipeMove = (e) => {
        containerTranslate.value = clamp(e.deltaY, -40, 40);
    };

    const containerSwipeEnd = (e) => {
        if (containerTranslate.value <= -34) {
            emit('addSet', false);
        } else if (containerTranslate.value >= 34) {
            emit('addSet', true);
        }

        containerTranslate.value = 0;
    };

    onMounted(() => {
        const titleSwipe = createGesture({
            el: titleHandle.value,
            threshold: 10,
            direction: 'x',
            gestureName: 'horizontal-swipe',
            onMove: (e) => titleSwipeMove(e),
            onEnd: (e) => titleSwipeEnd(e)
        });

        const containerSwipe = createGesture({
            el: containerHandle.value,
            threshold: 10,
            direction: 'y',
            gestureName: 'container-swipe',
            onMove: (e) => containerSwipeMove(e),
            onEnd: (e) => containerSwipeEnd(e)
        });
        
        titleSwipe.enable(true);
        containerSwipe.enable(true);
    });

    watch(props.excerciseData, () => {
        for (let i = 0; i < props.excerciseData.length; i++) {
            if (!props.excerciseData[i].isWarmUp) {
                lastWarmUpIndex.value = i - 1;
                break;
            }
        }
    })

    const itemClicked = (item) => {
        item.active = !item.active;
        // pr stuff
    }

    const deleteSet = (index) => {
        props.excerciseData.splice(index, 1);
    }

</script>

<template>
    <div class="frame">
        <div style="margin: 0.5rem;">
            <p ref="titleRef" class="title" :style="{'transform': 'translateX(' + titleTranslate + 'px)'}">{{ props.excerciseTitle }}</p>
            <div style="position: absolute; background: red; height: 25px; transform: translateY(-30px);" :style="{width:`${titleTranslate}px`}"></div>
        </div>

        <div class="header-decoration"></div>

        <div class="container" ref="setContainer">
            <ListItem 
            v-for="(item, index) in props.excerciseData" 
            class="set" 
            :class="[{'glass': item.active},{'glass-accent': item.isPr}]" 
            :enable-gesture="true" 
            :translation-y="containerTranslate" 
            :max-displacement="[40, 0]"
            @click="itemClicked(item)"
            @swipe-right="deleteSet(index)"
            >
                <p class="item-text" :class="{'warm-up-text': item.isWarmUp}">{{ item.isWarmUp ? index + 1 : index - lastWarmUpIndex }}</p>
                <EditableTextBox class="item-text" :class="{'warm-up-text': item.isWarmUp}" v-model="item.reps" :auxiliary-text="' reps'" type="number"/>
                <EditableTextBox v-if="!editMode" class="item-text" :class="{'warm-up-text': item.isWarmUp}" v-model="item.weight" :auxiliary-text="'kg'" type="number"/> 
            </ListItem>

            <div v-if="containerTranslate <= -34" class="set phantom" :style="{'transform':'translateY(' + containerTranslate + 'px)'}">
                <p>+</p>
            </div>

            <div v-if="containerTranslate >= 34" class="set phantom" style="top:0;">
                <p>+</p>
            </div>
            
            <div v-if="props.excerciseData.length == 0" @click="emit('addSet', false)">
                <p class="item-text">+</p>
            </div>
        </div>
    </div>
</template>

<style scoped> 
.frame {
    margin: 0 2em;
    padding: 0;
}

.title {
    text-align: left;
    font-size: 25px;
    margin: 0;
}

.header-decoration {
    width: 100%;
    height: 2px;
    background-color: #eee;
}

.container {
    position: relative;
    margin: 0.5rem;
    margin-left: 1.5rem;
    overflow: hidden;
}

.set {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.set:last-child {
    margin-bottom: 0;
}

.item-text {
    margin: 0.2rem;
    font-size: 18px;
    border: none;
    background: none;
    color: #eee;
    text-align: center;
}

.item-text span {
    padding: 0.25rem 0.05rem;
}

.warm-up-text {
    color: #5a5a5a !important;
}

.phantom {
    position: absolute;
    width: calc(100% - 0.5rem);
    margin: 0.2rem;
    border: none;
    background: none;
    justify-content: center;
}

.phantom p {
    color: #eee;
    font-size: 22px;
    margin: 0;
}

@property --angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: true;
}

.glass {
    background: #72727217;
    
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    
    border-radius: 2px;
    border: 1px solid #eee;
}

.glass-accent { 
    background: #ffd30f17;
    
    box-shadow: 
    inset 0 0 5px #ffd0006e,
    0 0 5px #ffd0006e,
    0px 0 10px #ffd0003b,
    0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    
    border: 1px solid;
    border-image-source: conic-gradient(from var(--angle), #ffd30f, #ffd0006e, #ffd30f);
    border-image-slice: 1;
    border-radius: 2px;
    
    animation: rotate 4s linear infinite;
}


@keyframes rotate {
    100% {
        --angle: 360deg;
    }
}
</style>