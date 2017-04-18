import { Drawing, DrawingType, DrawingAttribute } from "./";

export interface Doc {
    name: string;
    drawingList: Drawing[];
    idMap: Partial<{
        [type in DrawingType]: number
    }>;
    attributes: DrawingAttributeMap
};

export interface DrawingAttributeMap {
    [id: string]: Partial<DrawingAttribute>
}