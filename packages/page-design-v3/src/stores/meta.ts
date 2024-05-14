import { defineStore } from 'pinia'
import {
  type ComponentInfo,
  type PageMeta,
  type ComponentRelationship,
  DragPosition
} from 'engine-types'
import { computed, ref } from 'vue'
import { v4 as uuid } from 'uuid'

/**
 * 根节点id
 */
const ROOT_ID = 'root'

export class StructNode {
  readonly id: string
  readonly name: string
  readonly type?: string
  private _parent: StructNode | null = null
  get parent(): StructNode | null {
    return this._parent
  }
  /**
   * 设置节点父节点，root节点无父节点
   */
  set parent(val: StructNode) {
    if (this.isRoot()) return
    this._parent = val
  }
  private _children: Array<StructNode> | null = null
  get children(): Array<StructNode> | null {
    return this._children || null
  }
  private set children(val: Array<StructNode>) {
    this._children = val
  }

  constructor(id: string, name: string, type?: 'flex-container') {
    this.id = id
    this.name = name
    this.type = type
  }

  /**
   * 判断是否为根节点
   */
  isRoot() {
    return this.id === ROOT_ID
  }

  /**
   * 获取当前节点信息
   */
  getNodeInfo(): ComponentInfo {
    return {
      id: this.id,
      name: this.name
    }
  }

  /**
   * 以当前节点为根节点获取所有节点信息
   */
  getNodeInfoList(): Array<ComponentInfo> {
    return [
      this.getNodeInfo(),
      ...(this.children
        ?.map((item) => item.getNodeInfoList())
        .reduce((previousValue, currentValue) => [...previousValue, ...currentValue]) || [])
    ]
  }

  /**
   * 以当前节点为根节点生成节点关系
   */
  getNodeRelationship(): ComponentRelationship {
    return {
      id: this.id,
      parentId: this.parent?.id,
      children: this.children?.map((item) => item.getNodeRelationship()) || null
    }
  }

  addChildren(...children: Array<StructNode>) {
    children.forEach((item) => {
      item.parent = this
    })
    if (!this.children) this.children = []
    this.children.push(...children)
  }
}

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
    let parent = sourceEl.parent
    if (!parent) {
      // root 节点
      if (position === DragPosition.INNER) {
        const newStructNode = new StructNode(getNewUUID(), componentInfo.name)
        structNodeMap.value.set(newStructNode.id, newStructNode);
        sourceEl.addChildren(newStructNode)
        newStructNode.parent = sourceEl
      }
      return
    }
    if (!parent.type) {
      const index = parent.children!.findIndex((item) => item === sourceEl)
      const replaceContainer = new StructNode(getNewUUID(), 'FlexLayout', 'flex-container')
      structNodeMap.value.set(replaceContainer.id, replaceContainer)
      sourceEl.parent = replaceContainer
      replaceContainer.addChildren(sourceEl)
      replaceContainer.parent = parent
      parent.children!.splice(index, 1, replaceContainer)
      parent = replaceContainer
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
