<script setup>
import ListItem from './ListItem.vue';
import EditableTextBox from './EditableTextBox.vue';
import InteractiveList from './InteractiveList.vue';
import { Icon } from '@iconify/vue';
import { onMounted, useTemplateRef, ref, watch } from 'vue'
import { createGesture } from '@ionic/vue';
import { clamp } from '../utils/math';
import { queryDatabase } from '../utils/database';
    
    const props = defineProps({
        excercise: Object, // {id, name, sets: {reps: 12, weight: 0, active: false, isPr: false, isWarmUp: warmUp}}
        editMode: Boolean,
        id: Number
    });

    const emit = defineEmits(['showHistory', 'removeExercise']);

    const lastWarmUpIndex = ref(-1);
    const titleTranslate = ref(0);
    const titleHandle = useTemplateRef('titleRef');

    const titleSwipeMove = (e) => {
        titleTranslate.value = clamp(e.deltaX, -40, 40);
    }

    const titleSwipeEnd = (e) => {
        if (titleTranslate.value >= 40) {
            emit('removeExercise', props.id)
        } else if (titleTranslate.value <= -40) {
            emit('showHistory', props.excercise.id)
        }

        titleTranslate.value = 0;
    }

    onMounted(() => {
        const titleSwipe = createGesture({
            el: titleHandle.value,
            threshold: 10,
            direction: 'x',
            gestureName: 'horizontal-swipe',
            onMove: (e) => titleSwipeMove(e),
            onEnd: (e) => titleSwipeEnd(e)
        });
        
        titleSwipe.enable(true);
    });

    watch(props.excercise?.sets, async () => {
        for (let i = 0; i < props.excercise.sets.length; i++) {
            if (!props.excercise.sets[i].isWarmUp) {
                lastWarmUpIndex.value = i - 1;
                break;
            }
        }

        const res = (await queryDatabase(`SELECT * FROM exercises WHERE id=${props.excercise.id}`)).values[0];
        let ormMax = res.personalBest;
        for (let i = 0; i < props.excercise.sets.length; i++) {
            if (props.excercise.sets[i].isWarmUp) {
                continue;
            }

            const currentORM = props.excercise.sets[i].weight * ( 1 + props.excercise.sets[i].reps / 30);
            props.excercise.sets[i].isPr = currentORM > ormMax;
            ormMax = Math.max(ormMax, currentORM);
        }
    })

    const itemClicked = async (item) => {
        if (props.editMode) return;
        item.active = !item.active;
    }

    const addSet = (warmUp) => {
        if (warmUp) {
            props.excercise.sets.unshift({reps: 12, weight: 0, active: false, isPr: false, isWarmUp: true})
        } else {
            props.excercise.sets.push({reps: 12, weight: 0, active: false, isPr: false, isWarmUp: false})
        }
    }

    const deleteSet = (index) => {
        props.excercise.sets.splice(index, 1);
    }

</script>

<template>
    <div class="frame" @touchstart="disableScroll">
        <div style="margin: 0.5rem; position: relative;">
            <p ref="titleRef" class="title" :style="{'transform': 'translateX(' + titleTranslate + 'px)'}">{{ props.excercise.name }}</p>
            <Icon v-if="titleTranslate >= 35" icon="tabler:trash" style="position: absolute; top: 7px;" height="25" width="25"/>
            <Icon v-if="titleTranslate <= -35" icon="tabler:calendar-week" style="position: absolute; top: 7px; right: 0;" height="25" width="25"/>
        </div>

        <div class="header-decoration"></div>

        <InteractiveList class="container"
            :list="props.excercise.sets"
            :icon-size="25"
            :max-swipe-up="34"
            :max-swipe-down="34"
            @swipe-up="addSet(false)"
            @swipe-down="addSet(true)"
            v-slot="{ translationY }"
        >
            <ListItem class="set" 
                v-for="(item, index) in props.excercise.sets"
                :class="[{'glass': item.active && !item.isPr},{'glass-accent': item.active && item.isPr}]"     
                @click="itemClicked(item)"
                @swipe-right="deleteSet(index)"
                :enable-gesture="true" 
                :max-displacement="[40, 0]"
                :icons="['tabler:trash', '']"
                :translation-y="translationY" 
            >
                <p class="item-text" :class="{'warm-up-text': item.isWarmUp}">{{ item.isWarmUp ? index + 1 : index - lastWarmUpIndex }}</p>
                <EditableTextBox class="item-text" :class="{'warm-up-text': item.isWarmUp}" v-model="item.reps" :auxiliary-text="' reps'" type="number"/>
                <EditableTextBox v-if="!editMode" class="item-text" :class="{'warm-up-text': item.isWarmUp}" v-model="item.weight" :auxiliary-text="'kg'" type="number"/> 
            </ListItem>
        </InteractiveList>
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