<template>
  <div class="regional-division-inner"></div>
</template>

<script setup lang="ts">
const props = defineProps({
  left: {
    type: Number,
    required: true
  },
  top: {
    type: Number,
    required: true
  },
  width: {
    required: true
  },
  height: {
    required: true
  }
})
</script>

<style scoped lang="scss">
.regional-division-inner {
  position: absolute;
  top: v-bind('props.top + "px"');
}
</style>