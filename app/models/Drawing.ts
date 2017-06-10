
/**
 * 图形类型
 *   - p: 点
 *   - d: 补间点
 *   - l: 线段
 *   - v: 路径
 */
export type DrawingType = "p" | "d" | "l" | "v";

export type OffsetDirection = "left" | "right" | "up" | "down";

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

export interface DrawingAttribute {
    /**
     * 当前属性属于什么类型的图形
     */
    type?: DrawingType,

    /** 图形显示的名称 */
    displayName?: string;

    /** 图形的尺寸，对于点，表示的是半径，对于线，表示的是粗细 */
    radius: number;

    /** 线条的粗细，适用于直线、 */
    thickness: number;

    /** 图形的颜色 */
    color: string;

    /** 图形是否可见 */
    visible: boolean;

    /**
     * 对于线和路径，所使用的 dash-array
     */
    dash: string;

    /** 动点轨迹粗细 */
    trackThickness: number;

    /** 轨迹所用的 dash-array */
    trackDash: string;

    /** 轨迹是否可见 */
    trackVisible: boolean;

    /** 轨迹颜色 */
    trackColor: string;
}

export type DefaultAttribute = {
    [type in DrawingType]: Partial<DrawingAttribute>;
}

const commonAttribute: DrawingAttribute = {
    visible: true,
    color: '#666',
    radius: 5,
    thickness: 2,
    dash: '5',
    trackColor: '#666',
    trackDash: '5',
    trackThickness: 5,
    trackVisible: false
}
export const defaultAttribute: DefaultAttribute = {
    p: {
        ...commonAttribute,
    },
    d: {
        ...commonAttribute,
    },
    l: {
        ...commonAttribute,
    },
    v: {
        ...commonAttribute,
    }
}

export function getAttributeWithDefault(drawing: Drawing, attribute: Partial<DrawingAttribute>): Partial<DrawingAttribute> {
    return {
        type: drawing.type,
        ...defaultAttribute[drawing.type],
        ...(attribute || {})
    };
}