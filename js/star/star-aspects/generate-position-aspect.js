import { Aspect, DynamicAspect } from './aspect.js';
import { getRandomTimingFunction } from './timing-functions.js';
const generatePosition = (width, height) => {
    return {
        x: Math.random() * (width + 1),
        y: Math.random() * (height + 1)
    };
};
export default (canvas, changeChance) => {
    const { width, height } = canvas;
    const start = generatePosition(width, height);
    if (Math.random() >= changeChance) {
        return new Aspect(start);
    }
    return new DynamicAspect({
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
};
