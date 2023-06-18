import { Aspect, DynamicAspect } from './aspect.js';
import { getRandomTimingFunction } from './timing-functions.js';
export default (bounds, changeChance) => {
    const { min, max } = bounds;
    if (Math.random() >= changeChance) {
        const value = (max - min) * Math.random() + min;
        return new Aspect(value);
    }
    let start = (max - min) * Math.random() + min;
    let end = (max - min) * Math.random() + min;
    if (start > end) {
        let temp = start;
        start = end;
        end = temp;
    }
    return new DynamicAspect({
        start,
        end,
        severity: Math.random(),
        updater: getRandomTimingFunction('inout')
    });
};
export const generateFader = (bounds, changeChance) => {
    const { min, max } = bounds;
    if (Math.random() >= changeChance) {
        return new Aspect(max);
    }
    return new DynamicAspect({
        start: min,
        end: max,
        severity: Math.random(),
        updater: getRandomTimingFunction('inout')
    });
};
