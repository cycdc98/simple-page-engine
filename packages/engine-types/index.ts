export interface ComponentInfo {
  id: string;
  name: string;
}

export interface ComponentRelationship {
  id: string;
  parentId?: string;
  children?: Array<ComponentRelationship>;
}

export interface PageMeta {
  relationship: ComponentRelationship;
  componentInfoList: Array<ComponentInfo>;
}
