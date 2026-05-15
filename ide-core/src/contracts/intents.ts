import type { TreeNode } from '../domain/types.js';
import type { WorkbenchArea } from '../domain/types.js';
import type { DocumentRecord } from '../domain/DocumentModule.js';
import type { Project } from '../domain/types.js';
import type { AssetConversionResult } from '../domain/types.js';
import type { EngineSessionStatus } from '../domain/EngineSessionModule.js';
import {
    SELECT_NODES,
    SET_TREE,
    TOGGLE_NODE_EXPANDED,
    SET_FOCUSED_NODE,
} from '../domain/SceneTreeModule.js';
import {
    OPEN_DOCUMENT,
    CLOSE_DOCUMENT,
    SET_ACTIVE_DOCUMENT,
    SET_DOCUMENT_DIRTY,
    SET_DOCUMENT_VIEW_STATE,
    RESTORE_DOCUMENTS,
} from '../domain/DocumentModule.js';
import {
    SET_PANEL_SIZES,
    REGISTER_WIDGET,
    OPEN_WIDGET,
    CLOSE_WIDGET,
    ACTIVATE_WIDGET,
} from '../domain/WorkbenchModule.js';
import {
    SET_PROJECT_PATH,
    SET_PROJECT,
    SET_LOADING,
    SET_ERROR,
    CLEAR_PROJECT,
} from '../domain/ProjectModule.js';
import {
    START_CONVERSION,
    SET_CONVERSION_RESULT,
    SET_CONVERSION_ERROR,
    SET_PROJECT_PERSIST_WARNING,
} from '../domain/AssetConversionModule.js';
import { SET_STATUS, SET_ERROR as ENGINE_SET_ERROR } from '../domain/EngineSessionModule.js';

export type SceneTreeIntent =
    | { type: typeof SELECT_NODES; payload: string[] }
    | { type: typeof SET_TREE; payload: { tree: TreeNode[] } }
    | { type: typeof TOGGLE_NODE_EXPANDED; payload: string }
    | { type: typeof SET_FOCUSED_NODE; payload: string | null };

export type DocumentIntent =
    | {
          type: typeof OPEN_DOCUMENT;
          payload: { uri: string; title?: string; viewState?: unknown };
      }
    | { type: typeof CLOSE_DOCUMENT; payload: { uri: string } }
    | { type: typeof SET_ACTIVE_DOCUMENT; payload: { uri: string | null } }
    | { type: typeof SET_DOCUMENT_DIRTY; payload: { uri: string; dirty: boolean } }
    | { type: typeof SET_DOCUMENT_VIEW_STATE; payload: { uri: string; viewState?: unknown } }
    | {
          type: typeof RESTORE_DOCUMENTS;
          payload: { documents: DocumentRecord[]; activeUri: string | null };
      };

export type WorkbenchIntent =
    | { type: typeof SET_PANEL_SIZES; payload: { groupId: string; sizes: number[] } }
    | {
          type: typeof REGISTER_WIDGET;
          payload: {
              id: string;
              title: string;
              defaultArea: WorkbenchArea;
              closable: boolean;
          };
      }
    | { type: typeof OPEN_WIDGET; payload: { id: string; area?: WorkbenchArea } }
    | { type: typeof CLOSE_WIDGET; payload: { id: string } }
    | { type: typeof ACTIVATE_WIDGET; payload: { id: string } };

export type ProjectIntent =
    | { type: typeof SET_PROJECT_PATH; payload: string | null }
    | { type: typeof SET_PROJECT; payload: Project }
    | { type: typeof SET_LOADING; payload: boolean }
    | { type: typeof SET_ERROR; payload: Error }
    | { type: typeof CLEAR_PROJECT };

export type AssetConversionIntent =
    | { type: typeof START_CONVERSION }
    | { type: typeof SET_CONVERSION_RESULT; payload: AssetConversionResult }
    | { type: typeof SET_CONVERSION_ERROR; payload: string }
    | { type: typeof SET_PROJECT_PERSIST_WARNING; payload: string | null };

export type EngineSessionIntent =
    | { type: typeof SET_STATUS; payload: EngineSessionStatus }
    | { type: typeof ENGINE_SET_ERROR; payload: string };

export type EditorIntent =
    | SceneTreeIntent
    | DocumentIntent
    | WorkbenchIntent
    | ProjectIntent
    | AssetConversionIntent
    | EngineSessionIntent;
