import { inject, type Ref } from 'vue';
import type { TreeNode } from '@zstudio/ide-core';
import type { ZkResultExtended } from '@/types/project';

export interface NestEditorContextValue {
  tree: Ref<TreeNode[]>;
  selectedIds: Ref<string[]>;
  openedNodes: Ref<TreeNode[]>;
  activeNode: Ref<string | null>;
  handleSelect: (ids: string[]) => void;
  handleTabChange: (nodeId: string) => void;
  handleTabClose: (nodeId: string) => void;
  zkResult: Ref<ZkResultExtended | null>;
  selectedZObject: Ref<unknown | null>;
  regenerateZko: () => Promise<ZkResultExtended | null>;
  notifyChange: () => void;
}

export const NEST_EDITOR_KEY = Symbol('nestEditor') as symbol;

export function useNestEditor(): NestEditorContextValue | undefined {
  return inject<NestEditorContextValue>(NEST_EDITOR_KEY);
}
