function imageFromSrc(file) {
    return new URL(`../assets/${file}`, import.meta.url).href
}
  

export {
    imageFromSrc
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
    exercises
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