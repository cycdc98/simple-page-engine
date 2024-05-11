import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useDragOverStore = defineStore('dragOver', () => {
  const _show = ref(false)

  const isShow = computed(() => _show.value)

  const set = () => {}

  return {
    _show,
    isShow,
    set
  }
})
