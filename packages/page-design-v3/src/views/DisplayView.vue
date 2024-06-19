<template>
  <CommonComponent v-loading='loadingStatus' :info='getStruct as StructNode' :container="ContainerType.FLOW" />
</template>

<script setup lang='ts'>
import { useMetaStore } from '@/stores/meta'
import { storeToRefs } from 'pinia'
import CommonComponent from '@/components/CommonComponent.vue'
import { computed } from 'vue'
import { StructNode, ContainerType } from 'engine-types'


const metaStore = useMetaStore()
const { getStruct, getInitFinsishStatus } = storeToRefs(metaStore)

metaStore.init({
  relationship: {
    id: 'root',
    parentId: null,
    children: null
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