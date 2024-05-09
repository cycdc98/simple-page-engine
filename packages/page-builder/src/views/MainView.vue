<template>
  <el-config-provider>
    <el-container class="page-container">
      <el-header>Header</el-header>
      <el-container>
        <el-aside>
          <div draggable="true" @dragstart="startDrag">按钮</div>
          <div draggable="true">xxx</div>
        </el-aside>
        <el-main>
          <el-scrollbar>
            <iframe :src="displayUrl" class="display-view" />
          </el-scrollbar>
        </el-main>
        <el-aside>
        </el-aside>
      </el-container>
    </el-container>
  </el-config-provider>
</template>

<script setup lang="ts">
const displayUrl = `${import.meta.env.BASE_URL}display`

const startDrag = (ev: DragEvent) => {
  ev.preventDefault()
}
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