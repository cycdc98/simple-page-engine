<template>
  <component :is='props.info.name' :key='props.info.id' :info='props.info' ref='commonComponent'
    @click.stop='generateSelectedRect' @dragover.stop="dragover" @dragenter.stop="dragenter" @dragleave.stop="dragleave"
    @dragexit.stop="dragexit" @drop.stop="drop" />
</template>

<script setup lang='ts'>
import { useMetaStore } from '@/stores/meta'
import { StructNode, ContainerType } from 'engine-types';
import { ref } from 'vue'
import type { PropType, Ref } from 'vue'
import CommonComponent from './CommonComponent.vue';
import { DragPosition } from 'engine-types'

const metaStore = useMetaStore()

const props = defineProps({
  info: {
    type: StructNode,
    required: true
  },
  container: {
    type: Number as PropType<ContainerType>,
    default: ContainerType.NONE,
    validator: (value: number) => {
      return Object.values(ContainerType).includes(value as ContainerType)
    }
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

let insert: DragPosition | null = null

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
  const newElBasicInfo = JSON.parse(ev.dataTransfer!.getData('text/plain') as string)
  ev.dataTransfer!.clearData()
  metaStore.insert(props.info.id, insert as DragPosition, newElBasicInfo)

  postMessage({
    type: 'dragElement', show: false
  })
}

const dragover = (ev: DragEvent) => {
  ev.preventDefault()
  const distance = {
    [DragPosition.TOP]: ev.clientY - componentPosition.top,
    [DragPosition.RIGHT]: componentPosition.right - ev.clientX,
    [DragPosition.BOTTOM]: componentPosition.bottom - ev.clientY,
    [DragPosition.LEFT]: ev.clientX - componentPosition.left
  }
  const minDistance = Math.min(...Object.values(distance))
  if (minDistance > 10) {
    insert = DragPosition.INNER
    postMessage({ type: 'dragElement', left: componentPosition.left, top: componentPosition.top, width: componentPosition.width, height: componentPosition.height, ins: DragPosition.INNER, show: true })
  } else {
    const ins = parseInt(Object.entries(distance).find(item => item[1] === minDistance)![0])
    insert = ins
    postMessage({
      type: 'dragElement', left: componentPosition.left, top: componentPosition.top, width: componentPosition.width, height: componentPosition.height, ins, show: true
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