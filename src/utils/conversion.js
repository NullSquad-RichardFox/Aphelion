function imageFromSrc(file) {
    return new URL(`../assets/${file}`, import.meta.url).href
}

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

export {
    imageFromSrc, isNumeric
}