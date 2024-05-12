/// <reference types="vite/client" />

declare type StructNode = {
  id: string;
  name: string;
  parent:  StructNode | null;
  children: Array<StructNode> | null;
}