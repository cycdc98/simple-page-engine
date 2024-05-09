import { defineStore } from 'pinia'
import type { ComponentInfo, PageMeta, ComponentRelationship } from 'engine-types'
import { ref } from 'vue'

/**
 * 根节点id
 */
const ROOT_ID = 'root'

class StructNode {
  readonly id: string
  readonly name: string
  get parent(): StructNode | null {
    return this.parent || null
  }
  /**
   * 设置节点父节点，root节点无父节点
   */
  set parent(val: StructNode) {
    if (this.isRoot()) return
    this.parent = val
  }
  privious: StructNode | null = null
  next: StructNode | null = null
  children: StructNode | null = null

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
  }

  /**
   * 判断是否为根节点
   */
  isRoot() {
    return this.id === ROOT_ID
  }

  /**
   * 子节点迭代器
   */
  *getChildrenIteration() {
    let cursor = this.children
    while (cursor) {
      yield cursor
      cursor = cursor.next
    }
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
      ...Array.from(this.getChildrenIteration())
        .map((item) => item.getNodeInfoList())
        .reduce((previousValue, currentValue) => [...previousValue, ...currentValue])
    ]
  }

  /**
   * 以当前节点为根节点生成节点关系
   */
  getNodeRelationship(): ComponentRelationship {
    return {
      id: this.id,
      parentId: this.parent?.id,
      children: Array.from(this.getChildrenIteration()).map((item) => item.getNodeRelationship())
    }
  }
}

export const useMetaStore = defineStore('meta', () => {
  /**
   * 页面元数据初始化状态
   */
  const initFinishStatus = ref(false)

  const getInitFinsishStatus = () => {
    return initFinishStatus.value
  }

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
    relationship.children?.forEach((item, index, array) => {
      const cursorChild = structNodeMap.value.get(item.id)
      if (!cursorChild) return
      if (index === 1) {
        current.children = cursorChild
        if (array.length > 1) {
          const secondChild = structNodeMap.value.get(array[2].id)
          if (secondChild) cursorChild.next = secondChild
        }
      } else if (index === array.length - 1) {
        const secondToLastChild = structNodeMap.value.get(array[index - 1].id)
        if (secondToLastChild) cursorChild.privious = secondToLastChild
      } else {
        const priviousOne = structNodeMap.value.get(array[index - 1].id)
        if (priviousOne) cursorChild.privious = priviousOne
        const nextOne = structNodeMap.value.get(array[index + 1].id)
        if (nextOne) cursorChild.next = nextOne
      }
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
   * 转换元数据
   */
  const toPageMeta = (): PageMeta => {
    const rootStructNode = structNodeMap.value.get('root') as StructNode
    return {
      relationship: rootStructNode.getNodeRelationship(),
      componentInfoList: rootStructNode.getNodeInfoList()
    }
  }

  return {
    initFinishStatus,
    getInitFinsishStatus,

    structNodeMap,
    init,
    toPageMeta
  }
})
