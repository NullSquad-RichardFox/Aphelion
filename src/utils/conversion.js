function imageFromSrc(file) {
    return new URL(`../assets/${file}`, import.meta.url).href
}

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

export {
    imageFromSrc, isNumeric
}

/* 
    Data Types

    'exercises.txt' 
    id
    name
    muscles worked

    'workoutTemplate.txt'
    id
    name
    exercises
    sets

    'currentWorkout.txt'
    id
    name
    timer
    exercises (id, name)
    sets: (total, active)
    weights

    'exerciseData.txt'
    id
    data: [
        workout id
        date
        sets
        weights
    ]
*/