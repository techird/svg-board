import { Doc, DrawingType } from '../models';


export interface RootState {
    // 当前活动的文档 ID
    activeDocId: string;

    // 文档列表，表示了文档的顺序
    docIds: string[];

    // 文档内容
    docs: {
        [docId: string]: Doc;
    },

    // UI 状态
    ui: UIState;
}

export type UIMode = DrawingType | "idle"
export interface UIState {
    /**
     * 当前的 UI 模式，如果是 DrawingType，则表示正在创建指定类型的图形中，如果是 idle，则表示为空闲模式
     */
    mode: UIMode,
    params: any[];
    tween: number;
    selectedDrawingId: string;
    showAllTrack: boolean;
}

export const initialRootState: RootState = {
    activeDocId: 'default',
    docIds: ['default'],
    docs: {
        default: {
            name: '默认',
            drawingList: [],
            idMap: { p: 0, d: 0, l: 0, v: 0 }
        }
    },
    ui: {
        mode: 'idle',
        params: [],
        tween: 0.5,
        selectedDrawingId: null,
        showAllTrack: false
    }
}