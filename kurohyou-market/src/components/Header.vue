<script setup>
defineProps(['title']);
</script>
<template>
  <header>
    <h1>{{ title }}</h1>
  </header>
</template>
<style scoped>
  header{
    display:flex;
    justify-content:space-between;
  }
</style>