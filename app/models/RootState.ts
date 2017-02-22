import { Drawing } from "./";

export type InteractiveMode = "static-point" | "dynamic-point" | "line" | "path" | "none"

export interface RootState {
    idMap: {
        p: number;
        d: number;
        l: number;
        v: number;
    };
    interactiveMode: InteractiveMode,
    interactiveParams: any[];
    tween: number;

    selectedDrawingId: string;
    drawingList: Drawing[];
    showAllTrack: boolean;
}
