import { Drawing, isStaticPoint, isDynamicPoint } from "../models";

type Tuple = [number, number];

function dig(drawingId: string, drawings: Drawing[], t: number, path: string[] = []): Tuple {
    // 环检测
    if (path.indexOf(drawingId) > -1) return [0, 0];
    path.push(drawingId);

    const drawing = drawings.find(x => x.id == drawingId);
    if (!drawing) return [0, 0];
    if (isStaticPoint(drawing)) {
        path.pop();
        return [drawing.x, drawing.y];
    }
    if (isDynamicPoint(drawing)) {
        const [fx, fy] = dig(drawing.from, drawings, t, path);
        const [tx, ty] = dig(drawing.to, drawings, t, path);
        const dx = tx - fx;
        const dy = ty - fy;
        path.pop();
        return [fx + dx * t, fy + dy * t];
    }
    path.pop();
    return [0, 0];
}

export function getPointPosition(drawingId: string, drawings: Drawing[], t: number) {
    return dig(drawingId, drawings, t).map(n => Math.round(n));
}