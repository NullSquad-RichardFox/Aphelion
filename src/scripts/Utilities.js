import { computed } from "vue";

function uuid() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
);
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(val, max));
}

function imageFromSrc(file) {
    return new URL(`../assets/${file}`, import.meta.url).href
}
  

export {
    uuid, clamp, imageFromSrc
}