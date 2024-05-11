<template>
  <CommonComponent v-loading='loadingStatus' :info='getStruct as StructNode' />
</template>

<script setup lang='ts'>
import { StructNode, useMetaStore } from '@/stores/meta'
import { storeToRefs } from 'pinia'
import CommonComponent from '@/components/CommonComponent.vue'
import { computed } from 'vue'

const metaStore = useMetaStore()
const { getStruct, getInitFinsishStatus } = storeToRefs(metaStore)

metaStore.init({
  relationship: {
    id: 'root'
  },
  componentInfoList: [
    { id: 'root', name: 'FlowLayout' }
  ]
})

const loadingStatus = computed(() => {
  return !getStruct.value || !getInitFinsishStatus.value
})
</script>

<style scoped lang='scss'>
.display-container {
  width: 100vw;
  height: 100vh;
}
</style>