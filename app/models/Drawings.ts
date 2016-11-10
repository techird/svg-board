
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
    return drawing.type == 'static-point';
}

export function isDynamicPoint(drawing: Drawing): drawing is DynamicPoint {
    return drawing.type == 'dynamic-point';
}

export function isLine(drawing: Drawing): drawing is Line {
    return drawing.type == 'line';
}

const idMap: { [name: string]: number } = {};

function nextId(name: string) {
    if (!idMap[name]) {
        idMap[name] = 0;
    }
    return name + (++idMap[name]);
}

let nextStaticPointIndex = 0;
export function createStaticPoint(x: number, y: number): StaticPoint {
    return {
        id: nextId('p'),
        type: "static-point",
        x, y
    };
}

export function createDynamicPoint(from: string, to: string): DynamicPoint {
    return {
        id: nextId('d'),
        type: "dynamic-point",
        from, to
    };
}

export function createLine(from: string, to: string): Line {
    return {
        id: nextId('l'),
        type: "line",
        from,
        to
    };
}