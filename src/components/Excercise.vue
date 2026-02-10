<script setup>
    const props = defineProps({
        excerciseTitle: String,
        excerciseData: Array,
        editMode: Boolean
    })

    const emit = defineEmits(['addSet']);

</script>

<template>
    <div class="frame">
        <div class="head">
            <p class="title">{{ props.excerciseTitle }}</p>
            <img src="../assets/editIcon.png" alt="" class="edit-icon">
        </div>

        <div class="container" v-for="(item, index) in props.excerciseData">
            <div class="set" :class="{active: item.active}" :style="[item.isPr ? 'border-color: #E6B617' : 'border-color: #eee']">
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