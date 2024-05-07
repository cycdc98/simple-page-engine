<template>
  <div @drop="drop" @dragover="dragover" class="display-container"></div>
</template>

<script setup lang="ts">
const drop = (ev: DragEvent) => {
  ev.preventDefault()
}

const dragover = (ev: DragEvent) => {
  ev.preventDefault()
}
</script>

<style scoped lang="scss">
.display-container {
  width: 100vw;
  height: 100vh;
}
</style>