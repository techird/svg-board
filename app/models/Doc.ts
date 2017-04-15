import { Drawing, DrawingType } from "./";

export interface Doc {
    name: string;
    drawingList: Drawing[];
    idMap: Partial<{
        [type in DrawingType]: number
    }>
};