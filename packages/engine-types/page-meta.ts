/**
 * 页面元数据描述信息
 */

/**
 * 组件信息
 */
export interface ComponentInfo {
  id: string;
  name: string;
}

/**
 * 组件上下级关系
 */
export interface ComponentRelationship {
  id: string;
  parentId: string | null;
  children: Array<ComponentRelationship> | null;
}

/**
 * 页面元数据
 */
export interface PageMeta {
  relationship: ComponentRelationship;
  componentInfoList: Array<ComponentInfo>;
}
