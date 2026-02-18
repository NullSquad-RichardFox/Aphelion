<script setup>
    import ListItem from './ListItem.vue';
    import { onMounted, useTemplateRef, ref } from 'vue'
    import { createGesture } from '@ionic/vue';
    
    const props = defineProps({
        excerciseTitle: String,
        excerciseData: Array,
        editMode: Boolean
    });

    const emit = defineEmits(['addSet']);

    const titleTranslate = ref(0);
    const containerTranslate = ref(0);
    const titleHandle = useTemplateRef('titleRef');
    const containerHandle = useTemplateRef('setContainer');

    onMounted(() => {
        const titleSwipeMove = (e) => {
            titleTranslate.value = e.deltaX;
        }

        const titleSwipeEnd = (e) => {
            titleTranslate.value = 0;
        }

        const titleSwipe = createGesture({
            el: titleHandle.value,
            threshold: 10,
            direction: 'x',
            gestureName: 'horizontal-swipe',
            onMove: (e) => titleSwipeMove(e),
            onEnd: (e) => titleSwipeEnd(e)
        })

        titleSwipe.enable(true);

        const containerSwipeMove = (e) => {
            containerTranslate.value = e.deltaY;
        };

        const containerSwipeEnd = (e) => {
            containerTranslate.value = 0;
        };

        const containerSwipe = createGesture({
            el: containerHandle.value,
            threshold: 10,
            direction: 'y',
            gestureName: 'container-swipe',
            onMove: (e) => containerSwipeMove(e),
            onEnd: (e) => containerSwipeEnd(e)
        });

        containerSwipe.enable(true);
    });

    const itemClicked = (item) => {
        item.active = !item.active;
        // pr stuff
    }

</script>

<template>
    <div class="frame">
        <div style="margin: 0.5rem;">
            <p ref="titleRef" class="title" :style="{'transform': 'translateX(' + titleTranslate + 'px)'}">{{ props.excerciseTitle }}</p>
        </div>

        <div class="header-decoration"></div>

        <div class="container" ref="setContainer">
            <ListItem 
            class="set" 
            v-for="(item, index) in props.excerciseData" 
            :class="[{'glass': item.active},{'glass-accent': item.isPr}]" 
            :enable-gesture="true" 
            :translation-y="containerTranslate" 
            :max-displacement="40" 
            left-icon="cardio.png" 
            right-icon="cardio.png" 
            @click="itemClicked(item)"
            >
                <p class="item-text" :class="{'warm-up-text': item.isWarmUp}">{{ index + 1}}</p>
                <p class="item-text" :class="{'warm-up-text': item.isWarmUp}">{{ item.reps }} reps</p>
                <p class="item-text" :class="{'warm-up-text': item.isWarmUp}" v-if="!editMode">{{item.weight}}kg</p>
            </ListItem>
        </div>

        <div class="container" v-if="props.excerciseData.length == 0">
            <div @click="emit('addSet', false)">
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
    margin: 0.5rem;
    margin-left: 1.5rem;
}

.set {
    display: flex;
    justify-content: space-between;
}

.item-text {
    margin: 0.2rem;
    font-size: 18px;
}

.warm-up-text {
    color: #5a5a5a !important;
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