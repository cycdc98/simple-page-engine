<template>
  <el-scrollbar>
    <div class="page-builder-dispaly-container" :class="{ 'drag-over': dragOverStatus }" @dragover="dragover"
      @dragenter="dragenter" @dragleave="dragleave" @dragexit="dragexit" @drop="drop">
      <template v-if="props.info.children?.length">
        <component v-for="item in props.info.children" :key="item.id" :is="item.name" :info="item" />
      </template>
      <template v-else>
        <FlexCenter>
          从组件库拖入组件进行构建
        </FlexCenter>
      </template>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import FlexCenter from '@/components/FlexCenter.vue'
import { StructNode } from '@/stores/meta'
import { ref } from 'vue';
const props = defineProps({
  info: {
    type: StructNode,
    required: true
  }
})

const dragOverStatus = ref(false)

const drop = (ev: DragEvent) => {
  dragOverStatus.value = false
  // JSON.parse(ev.dataTransfer!.getData('text/plain') as string)
  console.log('drop', ev)
}

const dragover = (ev: DragEvent) => {
  ev.preventDefault()
  console.log('dragover', ev)
}

const dragenter = (ev: DragEvent) => {
  ev.preventDefault()
  dragOverStatus.value = true
  console.log('dragenter', ev)
}

const dragleave = (ev: DragEvent) => {
  dragOverStatus.value = false
  console.log('dragleave', ev)
}

const dragexit = (ev: DragEvent) => {
  dragOverStatus.value = false
  console.log('dragexit', ev)
}
</script>

<style scoped lang="scss">
.page-builder-dispaly-container {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  background-color: #eee;

  &.drag-over {
    background-color: #ddd;
  }
}
</style>