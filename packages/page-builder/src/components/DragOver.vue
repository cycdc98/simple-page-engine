<template>
  <div class="drag-over-view" v-show="isShow" :style="styleObj"></div>
</template>

<script setup lang="ts">
import { useDragOverStore } from '@/stores/drag-over-store';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

enum InsPosition {
  INNER,
  TOP,
  RIGHT,
  BOTTOM,
  LEFT
}

const dragOverStore = useDragOverStore()

const { isShow, getWidth, getHeight, getLeft, getTop, getIns } = storeToRefs(dragOverStore)

const styleObj = computed(() => {
  if (getIns.value === InsPosition.INNER) {
    return {
      'background-color': '#fff'
    }
  }
  if (getIns.value === InsPosition.TOP) {
    return {
      'background-color': '#fff',
      'border-top': '10px solid #ddd'
    }
  }
  if (getIns.value === InsPosition.RIGHT) {
    return {
      'background-color': '#fff',
      'border-right': '10px solid #ddd'
    }
  }
  if (getIns.value === InsPosition.BOTTOM) {
    return {
      'background-color': '#fff',
      'border-bottom': '10px solid #ddd'
    }
  }
  if (getIns.value === InsPosition.LEFT) {
    return {
      'background-color': '#fff',
      'border-left': '10px solid #ddd'
    }
  }
  return {}
})
</script>

<style scoped lang="scss">
.drag-over-view {
  position: absolute;
  pointer-events: none;
  width: v-bind(getWidth);
  height: v-bind(getHeight);
  left: v-bind(getLeft);
  top: v-bind(getTop);
  box-sizing: border-box;
  opacity: 0.5;
}
</style>