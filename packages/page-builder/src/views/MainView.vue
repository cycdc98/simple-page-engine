<template>
  <el-config-provider>
    <el-container class="page-container">
      <el-header>Header</el-header>
      <el-container>
        <el-aside>
          <div draggable="true" @dragstart="startDrag">按钮</div>
        </el-aside>
        <el-main>
          <el-scrollbar>
            <iframe :src="displayUrl" class="display-view" />
            <SelectedElement />
            <DragOver />
          </el-scrollbar>
        </el-main>
        <el-aside>
        </el-aside>
      </el-container>
    </el-container>
  </el-config-provider>
</template>

<script setup lang="ts">
import SelectedElement from '@/components/SelectedElement.vue'
import DragOver from '@/components/DragOver.vue';
import { useDragOverStore } from '@/stores/drag-over-store'
import { useSelectedElementStore } from '@/stores/selected-element-store'

const dragOverStore = useDragOverStore()
const selectedElementStore = useSelectedElementStore()

const displayUrl = `${import.meta.env.VITE_DESIGN_URL}`

const startDrag = (ev: DragEvent) => {
  ev.dataTransfer!.setData('text/plain', JSON.stringify({
    name: 'ElButton'
  }))
}

window.addEventListener('message', ({ data }) => {
  switch (data.type) {
    case 'selectElement':
      selectedElementStore.set({ width: data.width, height: data.height, top: data.top, left: data.left, info: data.left, show: data.show })
      break;
    case 'dragElement':
      dragOverStore.set({ width: data.width, height: data.height, left: data.left, top: data.top, ins: data.ins, show: data.show })
      break;
    default:
      break;
  }
})
</script>

<style scoped lang="scss">
:deep(.el-scrollbar) {
  .el-scrollbar__view {
    height: 100%;
    width: 100%;
    position: relative;
  }
}

.page-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;


  .display-view {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%
  }
}
</style>