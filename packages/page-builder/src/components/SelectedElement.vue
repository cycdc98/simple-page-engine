<template>
  <div class="selected-element-view" v-show="isShow"></div>
</template>

<script setup lang="ts">
import { useSelectedElementStore } from '@/stores/selected-element-store'
import { storeToRefs } from 'pinia'

const selectedElementStore = useSelectedElementStore()
const { getWidth, getHeight, getLeft, getTop, isShow } = storeToRefs(selectedElementStore)
</script>

<style scoped lang="scss">
.selected-element-view {
  position: absolute;
  pointer-events: none;
  border: 1px solid black;
  width: v-bind(getWidth);
  height: v-bind(getHeight);
  left: v-bind(getLeft);
  top: v-bind(getTop);
  box-sizing: border-box;
}
</style>