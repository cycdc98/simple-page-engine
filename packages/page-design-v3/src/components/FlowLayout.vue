<template>
  <el-scrollbar>
    <div class="page-builder-dispaly-container">
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
}
</style>