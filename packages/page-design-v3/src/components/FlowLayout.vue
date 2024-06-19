<template>
  <el-scrollbar>
    <div class="page-builder-dispaly-container">
      <template v-if="props.info.children?.length">
        <CommonComponent v-for="item in props.info.children" :key="item.id" :info="item" :id="item.id" />
      </template>
      <template v-else>
        <div class="flex-center">
          从组件库拖入组件进行构建
        </div>
      </template>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import CommonComponent from '@/components/CommonComponent.vue'
import { StructNode } from '@/stores/meta'
const props = defineProps({
  info: {
    type: StructNode,
    required: true
  }
})
</script>

<style scoped lang="scss">
.page-builder-dispaly-container {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  background-color: #eee;

  .flex-center {
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    color: #aaa;
  }
}
</style>