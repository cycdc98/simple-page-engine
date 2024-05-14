import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { DragPosition } from 'engine-types'

export const useDragOverStore = defineStore('dragOver', () => {
  const _show = ref(false)
  const _width = ref(0)
  const _height = ref(0)
  const _left = ref(0)
  const _top = ref(0)
  const _ins: Ref<DragPosition> = ref(DragPosition.INNER)

  const isShow = computed(() => _show.value)
  const getWidth = computed(() => `${_width.value}px`)
  const getHeight = computed(() => `${_height.value}px`)
  const getLeft = computed(() => `${_left.value}px`)
  const getTop = computed(() => `${_top.value}px`)
  const getIns = computed(() => _ins.value)

  const set = ({
    width,
    height,
    left,
    top,
    ins,
    show
  }: {
    width: number
    height: number
    left: number
    top: number
    ins: DragPosition
    show: boolean
  }) => {
    if (!show) {
      _show.value = false
      return
    }
    _show.value = true
    _width.value = width
    _height.value = height
    _left.value = left
    _top.value = top
    _ins.value = ins
  }

  const hidden = () => {
    _show.value = false
  }

  return {
    _show,
    isShow,
    getWidth,
    getHeight,
    getLeft,
    getTop,
    getIns,
    set,
    hidden
  }
})
