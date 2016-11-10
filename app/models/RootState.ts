import { Drawing } from "./";

export type InteractiveMode = "static-point" | "dynamic-point" | "line" | "none"

export interface RootState {
    interactiveMode?: InteractiveMode,
    interactiveParams?: any[][];
    tween?: number;

    activeDrawingId?: string;
    drawingList?: Drawing[];
}
