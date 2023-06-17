import {
    Aspect,
    DynamicAspect
} from './aspect.js';

import { getRandomTimingFunction } from './timing-functions.js';

export type Bounds = {
    min: number,
    max: number
}

export default (bounds: Bounds, changeChance: number) : Aspect<number> => {

    const { min, max } = bounds;

    if (Math.random() >= changeChance) {
        const value = (max - min) * Math.random() + min;
        return new Aspect<number>(value);
    }

    let start = (max - min) * Math.random() + min;
    let end = (max - min) * Math.random() + min;
    if (start > end) {
        let temp = start;
        start = end;
        end = temp;
    }


    return new DynamicAspect<number>({
        start,
        end,
        severity: Math.random(),
        updater: getRandomTimingFunction('inout')
    });
}

export const generateFader = (bounds: Bounds, changeChance: number) : Aspect<number> => {
    const { min, max } = bounds;

    if (Math.random() >= changeChance) {
        return new Aspect<number>(max);
    }

    return new DynamicAspect<number>({
        start: min,
        end: max,
        severity: Math.random(),
        updater: getRandomTimingFunction('inout')
    });
};
