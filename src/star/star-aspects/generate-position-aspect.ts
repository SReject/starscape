import {
    Aspect,
    DynamicAspect
} from './aspect.js';

import { getRandomTimingFunction } from './timing-functions.js';

export type Position = { x: number, y: number };

const generatePosition = (width: number, height: number) : Position => {
    return {
        x: Math.random() * (width + 1),
        y: Math.random() * (height + 1)
    }
}

export default (canvas: { width: number, height: number }, changeChance: number) : Aspect<Position> => {
    const { width, height } = canvas;

    const start = generatePosition(width, height);

    if (Math.random() >= changeChance) {
        return new Aspect<Position>(start);
    }

    return new DynamicAspect<Position>({
        start,
        end: generatePosition(width, height),
        severity: Math.random(),
        traverse: (start, end, callback) => {
            return {
                x: callback(start.x, end.x),
                y: callback(start.y, end.y)
            };
        },
        updater: getRandomTimingFunction('inonly')
    });
}

