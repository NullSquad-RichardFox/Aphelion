function imageFromSrc(file) {
    return new URL(`../assets/${file}`, import.meta.url).href
}
  

export {
    imageFromSrc
}