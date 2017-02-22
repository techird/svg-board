
export type DrawingType = "static-point" | "dynamic-point" | "line" | "path";

export interface Drawing {
    id: string;
    type: DrawingType;
}
export interface StaticPoint extends Drawing {
    x: number;
    y: number;
}
export interface DynamicPoint extends Drawing {
    from: string;
    to: string;
}
export interface Line extends Drawing {
    from: string;
    to: string;
}
export interface Path extends Drawing {
    data: string;
}

export function isStaticPoint(drawing: Drawing): drawing is StaticPoint {
    return drawing && drawing.type == 'static-point';
}

export function isDynamicPoint(drawing: Drawing): drawing is DynamicPoint {
    return drawing && drawing.type == 'dynamic-point';
}

export function isLine(drawing: Drawing): drawing is Line {
    return drawing && drawing.type == 'line';
}

export function isPath(drawing: Drawing): drawing is Path {
    return drawing && drawing.type == 'path';
}

let nextStaticPointIndex = 0;
export function createStaticPoint(x: number, y: number): StaticPoint {
    return {
        id: 'p',
        type: "static-point",
        x, y
    };
}

export function createDynamicPoint(from: string, to: string): DynamicPoint {
    return {
        id: 'd',
        type: "dynamic-point",
        from, to
    };
}

export function createLine(from: string, to: string): Line {
    return {
        id: 'l',
        type: "line",
        from,
        to
    };
}

export function createPath(data: string) {
    return {
        id: 'v',
        type: "path",
        data
    };
}