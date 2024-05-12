<template>
  <component :is='props.info.name' :key='props.info.id' :info='props.info' ref='commonComponent'
    @click.stop='generateSelectedRect' @dragover="dragover" @dragenter="dragenter" @dragleave="dragleave"
    @dragexit="dragexit" @drop="drop" />
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

const componentPosition = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  bottom: 0,
  right: 0
}

enum InsPosition {
  INNER,
  TOP,
  RIGHT,
  BOTTOM,
  LEFT
}

const commonComponent: Ref<InstanceType<typeof CommonComponent> | null> = ref(null)

const postMessage = (message: any) => {
  window.parent.postMessage(message, "*")
}

const generateSelectedRect = () => {
  if (commonComponent.value?.$el) {
    const rect = commonComponent.value.$el.getBoundingClientRect() as DOMRect
    postMessage({ type: 'selectElement', show: true, left: rect.left, top: rect.top, width: rect.width, height: rect.height, info: { id: props.info.name, name: props.info.name } })
  }
}

const drop = (ev: DragEvent) => {
  // JSON.parse(ev.dataTransfer!.getData('text/plain') as string)
  ev.dataTransfer!.clearData()
  postMessage({
    type: 'dragElement', show: false
  })
}

const dragover = (ev: DragEvent) => {
  ev.preventDefault()
  const distance = {
    [InsPosition.TOP]: ev.clientY - componentPosition.top,
    [InsPosition.RIGHT]: componentPosition.right - ev.clientX,
    [InsPosition.BOTTOM]: componentPosition.bottom - ev.clientY,
    [InsPosition.LEFT]: ev.clientX - componentPosition.left
  }
  const minDistance = Math.min(...Object.values(distance))
  if (minDistance > 10) {
    postMessage({ type: 'dragElement', left: componentPosition.left, top: componentPosition.top, width: componentPosition.width, height: componentPosition.height, ins: InsPosition.INNER, show: true })
  } else {
    postMessage({
      type: 'dragElement', left: componentPosition.left, top: componentPosition.top, width: componentPosition.width, height: componentPosition.height, ins: parseInt(Object.entries(distance).find(item => item[1] === minDistance)![0]), show: true
    })
  }
}

const dragenter = (ev: DragEvent) => {
  ev.preventDefault()
  if (commonComponent.value?.$el) {
    const rect = commonComponent.value.$el.getBoundingClientRect() as DOMRect
    componentPosition.left = rect.left
    componentPosition.top = rect.top
    componentPosition.width = rect.width
    componentPosition.height = rect.height
    componentPosition.bottom = rect.bottom
    componentPosition.right = rect.right
  }
}

const dragleave = (ev: DragEvent) => {
  console.log('dragleave', ev)
  postMessage({
    type: 'dragElement', show: false
  })
}

const dragexit = (ev: DragEvent) => {
  console.log('dragexit', ev)
  postMessage({
    type: 'dragElement', show: false
  })
}
</script>