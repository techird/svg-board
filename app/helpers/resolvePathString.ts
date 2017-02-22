import { Drawing, isPath, isStaticPoint, isDynamicPoint, Path } from "../models";
import { getPointPosition } from "./getPointPosition";

type Tuple = [number, number];

export function resolvePathString(path: Path, drawings: Drawing[], t: number, forgive = false) {
    let isInvalidVariable = false;
    const pathString = path.data.replace(/\{\s*(\w+)\s*\}/g, (match, $1) => {
        const drawing = drawings.find(x => x.id == $1);
        if (isStaticPoint(drawing) || isDynamicPoint(drawing)) {
            return getPointPosition(drawing.id, drawings, t).join(' ');
        }
        isInvalidVariable = true;
        return match;
    });
    try {
        const data = parse(pathString);
        return data.map(part => part.join(' ')).join(' ');
    } catch (e) {
        return null;
    }
}

function parse(path: string, forgive = false) {
    const length = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0}

    const segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig;

    const data = [];
    path.replace(segment, (_, command, args) => {
        let type = command.toLowerCase()
        args = parseValues(args)

        // overloaded moveTo
        if (type == 'm' && args.length > 2) {
            data.push([command].concat(args.splice(0, 2)))
            type = 'l'
            command = command == 'm' ? 'l' : 'L'
        }

        while (true) {
            if (args.length == length[type]) {
                args.unshift(command);
                data.push(args);
                return _;
            }
            if (args.length < length[type]) {
                if (!forgive) {
                    throw new Error('malformed path data')
                }
                return _;
            }
            data.push([command].concat(args.splice(0, length[type])))
        }
    })
    return data;
}

var number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;
function parseValues(args) {
    var numbers = args.match(number)
    return numbers ? numbers.map(Number) : []
}