import { defineStore } from 'pinia'
import {
  type ComponentInfo,
  type PageMeta,
  type ComponentRelationship,
  DragPosition,
  StructNode,
  ROOT_ID
} from 'engine-types'
import { computed, ref } from 'vue'
import { v4 as uuid } from 'uuid'

export const useMetaStore = defineStore('meta', () => {
  /**
   * 页面元数据初始化状态
   */
  const initFinishStatus = ref(false)

  const getInitFinsishStatus = computed(() => {
    return initFinishStatus.value
  })

  /**
   * 元素节点映射表
   */
  const structNodeMap = ref(new Map<string, StructNode>())

  /**
   * 实例化元素节点
   * @param relationship
   * @param componentList
   */
  const initStructNode = (
    relationship: ComponentRelationship,
    componentList: Array<ComponentInfo>
  ): void => {
    const componentItem = componentList.find((item) => item.id === relationship.id)
    if (!componentItem) return
    const structNode = new StructNode(componentItem.id, componentItem.name)
    structNodeMap.value.set(componentItem.id, structNode)
    relationship.children?.forEach((relationshipItem) =>
      initStructNode(relationshipItem, componentList)
    )
  }

  /**
   * 关联元素节点关系
   * @param relationship
   */
  const initRelationship = (relationship: ComponentRelationship) => {
    const current = structNodeMap.value.get(relationship.id)
    if (!current) return
    if (relationship.parentId) {
      const parent = structNodeMap.value.get(relationship.parentId)
      if (parent) {
        current.parent = parent
      }
    }
    relationship.children?.forEach((item) => {
      const cursorChild = structNodeMap.value.get(item.id) as StructNode | undefined
      if (!cursorChild) return
      current.addChildren(cursorChild)
      initRelationship(item)
    })
  }

  /**
   * 初始化
   */
  const init = (content: PageMeta) => {
    initStructNode(content.relationship, content.componentInfoList)
    initRelationship(content.relationship)
    initFinishStatus.value = true
  }

  /**
   * 结构
   */
  const getStruct = computed(() => {
    return structNodeMap.value.get(ROOT_ID)
  })

  /**
   * 转换元数据
   */
  const toPageMeta = (): PageMeta => {
    const rootStructNode = structNodeMap.value.get(ROOT_ID) as StructNode
    return {
      relationship: rootStructNode.getNodeRelationship(),
      componentInfoList: rootStructNode.getNodeInfoList()
    }
  }

  const getNewUUID = () => {
    let newId
    do {
      newId = uuid()
    } while (structNodeMap.value.has(newId))
    return newId
  }

  /**
   * 插入节点
   */
  const insert = (id: string, position: DragPosition, componentInfo: { name: string }) => {
    const sourceEl = structNodeMap.value.get(id) as StructNode
    const parent = sourceEl.parent
    if (!parent) {
      // root 节点
      if (position === DragPosition.INNER) {
        const newStructNode = new StructNode(getNewUUID(), componentInfo.name)
        structNodeMap.value.set(newStructNode.id, newStructNode)
        sourceEl.addChildren(newStructNode)
        newStructNode.parent = sourceEl
      }
      return
    }
    const index = parent.children!.findIndex((item) => item === sourceEl)
    const newStructNode = new StructNode(getNewUUID(), componentInfo.name)
    structNodeMap.value.set(newStructNode.id, newStructNode)
    if (position === DragPosition.LEFT) {
      parent.children!.splice(index, 0, newStructNode)
      newStructNode.parent = parent
    } else if (position === DragPosition.RIGHT) {
      parent.children!.splice(index + 1, 0, newStructNode)
      newStructNode.parent = parent
    } else if (position === DragPosition.TOP) {
      const parentIndex = parent.parent!.children!.findIndex((item) => item === parent)
      parent.parent?.children?.splice(parentIndex, 0, newStructNode)
      newStructNode.parent = parent.parent as StructNode
    } else if (position === DragPosition.BOTTOM) {
      const parentIndex = parent.parent!.children!.findIndex((item) => item === parent)
      parent.parent?.children?.splice(parentIndex + 1, 0, newStructNode)
      newStructNode.parent = parent.parent as StructNode
    }
  }

  return {
    initFinishStatus,
    getInitFinsishStatus,

    structNodeMap,
    init,
    getStruct,
    toPageMeta,
    insert
  }
})
