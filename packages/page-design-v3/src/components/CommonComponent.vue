<template>
  <component :is='props.info.name' :key='props.info.id' :info='props.info' ref='commonComponent'
    @click.stop='generateSelectedRect' />
</template>

<script setup lang='ts'>
import { StructNode } from '@/stores/meta'
import { ref } from 'vue'
import type { Ref } from 'vue'
import CommonComponent from './CommonComponent.vue';

const props = defineProps({
  info: {
    type: StructNode,
    required: true
  }
})

const commonComponent: Ref<InstanceType<typeof CommonComponent> | null> = ref(null)

const postMessage = (message: any) => {
  window.parent.postMessage(message, "*")
}

const generateSelectedRect = () => {
  if (commonComponent.value?.$el) {
    const rect = commonComponent.value.$el.getBoundingClientRect()
    postMessage({ type: 'selectElement', show: true, left: rect.left, top: rect.top, width: rect.width, height: rect.height })
  }
}
</script>