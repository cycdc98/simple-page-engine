<template>
  <div></div>
</template>

<script setup lang="ts">
import { StructNode } from '@/stores/meta'
const props = defineProps({
  info: {
    type: StructNode,
    required: true
  }
})
console.log(props.info)
</script>