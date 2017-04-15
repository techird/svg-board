
/**
 * 图形类型
 *   - p: 点
 *   - d: 补间点
 *   - l: 线段
 *   - v: 路径
 */
export type DrawingType = "p" | "d" | "l" | "v";

export interface DrawingBase {
    id: string;
}
export interface StaticPoint extends DrawingBase {
    type: "p",
    x: number;
    y: number;
}
export interface DynamicPoint extends DrawingBase {
    type: "d",
    from: string;
    to: string;
}
export interface Line extends DrawingBase {
    type: "l",
    from: string;
    to: string;
}
export interface Path extends DrawingBase {
    type: "v",
    data: string;
}
export type Drawing = StaticPoint | DynamicPoint | Line | Path;

export function createStaticPoint(x: number, y: number): StaticPoint {
    return { id: "p", type: "p", x, y };
}

export function createDynamicPoint(from: string, to: string): DynamicPoint {
    return { id: "d", type: "d", from, to };
}

export function createLine(from: string, to: string): Line {
    return { id: "l", type: "l", from, to };
}

export function createPath(data: string): Path {
    return { id: "v", type: "v", data };
}