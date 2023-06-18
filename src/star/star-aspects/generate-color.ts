import {
    type MinMax
} from '../../util/resolve-min-max.js';

import {
    Aspect,
    DynamicAspect
} from './aspect.js';

import { getRandomTimingFunction } from './timing-functions.js';

export type RGB = {
    red:   number,
    green: number,
    blue:  number
}

const getColorBounds = (minMax?: number | MinMax) : { offset: number, range: number } => {
    if (minMax == null) {
        return { offset: 255, range: 0 };
    }

    if (typeof minMax === 'number') {
        return { offset: minMax, range: 0 };
    }

    let { min, max } = minMax;

    if (min == null) {
        return { offset: max, range: 0 };
    }

    if (min > max) {
        let temp = min;
        min = max;
        max = temp;
    }

    return { offset: min, range: max - min };
}

const generateColor = (bounds) : RGB => {
    const { red, green, blue } = bounds;

    const rb = getColorBounds(red);
    const gb = getColorBounds(green);
    const bb = getColorBounds(blue);

    return {
        red:   rb.offset + Math.random() * rb.range,
        green: gb.offset + Math.random() * gb.range,
        blue:  bb.offset + Math.random() * bb.range
    };
}

export interface ColorBounds {
    red?:   MinMax,
    green?: MinMax,
    blue?:  MinMax
}

export default (bounds: ColorBounds, changeChance: number) : Aspect<RGB> => {
    const start = generateColor(bounds);

    if (Math.random() >= changeChance) {
        return new Aspect<RGB>(start);
    }

    return new DynamicAspect<RGB>({
        start,
        end: generateColor(bounds),
        severity: Math.random(),
        traverse: (start, end, callback) => {
            return {
                red: callback(start.red, end.red),
                green: callback(start.green, end.green),
                blue: callback(start.blue, end.blue)
            };
        },
        updater: getRandomTimingFunction('any')
    });
}
