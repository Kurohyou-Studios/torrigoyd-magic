<script setup>
const props = defineProps({
    text: String,
    color: String
});
defineEmits(['click']);
</script>
<template>
  <button @click="(event) => $emit('button-click',event)" :style="{'background-color':color}" class="btn">{{ text }}</button>
</template>