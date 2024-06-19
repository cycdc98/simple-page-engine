/**
 * 设计/运行 元数据结构
 */
import { type ComponentInfo, type ComponentRelationship } from "./index";

/**
 * 根节点ID
 */
export const ROOT_ID = "root";

/**
 * 设计/运行 节点类
 */
export class StructNode {
  readonly id: string;
  readonly name: string;

  private _parent: StructNode | null = null;
  get parent(): StructNode | null {
    return this._parent;
  }
  set parent(val: StructNode) {
    //设置节点父节点，root节点无父节点
    if (this.isRoot()) return;
    this._parent = val;
  }

  private _children: Array<StructNode> | null = null;
  get children(): Array<StructNode> | null {
    return this._children || null;
  }
  private set children(val: Array<StructNode>) {
    this._children = val;
  }

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  /**
   * 判断是否为根节点
   */
  isRoot() {
    return this.id === ROOT_ID;
  }

  /**
   * 获取当前节点信息
   */
  getNodeInfo(): ComponentInfo {
    return {
      id: this.id,
      name: this.name,
    };
  }

  /**
   * 以当前节点为根节点获取所有节点信息
   */
  getNodeInfoList(): Array<ComponentInfo> {
    return [
      this.getNodeInfo(),
      ...(this.children
        ?.map((item) => item.getNodeInfoList())
        .reduce((previousValue, currentValue) => [
          ...previousValue,
          ...currentValue,
        ]) || []),
    ];
  }

  /**
   * 以当前节点为根节点生成节点关系
   */
  getNodeRelationship(): ComponentRelationship {
    return {
      id: this.id,
      parentId: this.parent?.id || null,
      children:
        this.children?.map((item) => item.getNodeRelationship()) || null,
    };
  }

  addChildren(...children: Array<StructNode>) {
    children.forEach((item) => {
      item.parent = this;
    });
    if (!this.children) this.children = [];
    this.children.push(...children);
  }
}

export enum ContainerType {
  NONE,
  FLOW,
  FLEX,
}
