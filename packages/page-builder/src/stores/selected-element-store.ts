import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSelectedElementStore = defineStore('selectedElement', () => {
  const _width = ref(0)
  const _height = ref(0)
  const _left = ref(0)
  const _top = ref(0)
  const _show = ref(false)

  const getWidth = computed(() => `${_width.value}px`)
  const getHeight = computed(() => `${_height.value}px`)
  const getLeft = computed(() => `${_left.value}px`)
  const getTop = computed(() => `${_top.value}px`)
  const isShow = computed(() => _show.value)

  const set = ({
    width,
    height,
    left,
    top,
    show
  }: {
    width: number
    height: number
    left: number
    top: number
    show: boolean
  }) => {
    _width.value = width
    _height.value = height
    _left.value = left
    _top.value = top
    _show.value = show
  }

  const hidden = () => {
    _show.value = false
  }

  return {
    _width,
    _height,
    _left,
    _top,
    _show,

    getWidth,
    getHeight,
    getLeft,
    getTop,
    isShow,

    set,
    hidden
  }
})
