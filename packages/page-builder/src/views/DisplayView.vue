<template>
  <component :is="getStruct?.name" :key="getStruct?.id" :info="getStruct" />
</template>

<script setup lang="ts">
import { useMetaStore } from '@/stores/meta'
import { storeToRefs } from 'pinia';

const metaStore = useMetaStore()
const { getStruct } = storeToRefs(metaStore)

metaStore.init({
  relationship: {
    id: 'root',
  },
  componentInfoList: [
    { id: 'root', name: 'FlowLayout' }
  ]
})
</script>

<style scoped lang="scss">
.display-container {
  width: 100vw;
  height: 100vh;
}
</style>