<template>
  <div class="drag-over-view" v-show="isShow"></div>
</template>

<script setup lang="ts">
import { useDragOverStore } from '@/stores/drag-over-store';
import { storeToRefs } from 'pinia';
const dragOverStore = useDragOverStore()

const { isShow } = storeToRefs(dragOverStore)
</script>

<style scoped lang="scss">
.drag-over-view {
  position: absolute;
}
</style>