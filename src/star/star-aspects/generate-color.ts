import {
    default as resolveMinMax,
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

const generateColor = (bias: MinMax) : RGB => {
    const { min, max } = resolveMinMax(bias);

    const a1 = min + Math.floor(Math.random() * (1 + max));
    const a2 = min + Math.floor(Math.random() * (1 + max));

    switch (Math.floor(Math.random() * 7)) {
        case 0: // R## - Red
            return { red: 255, green: a1, blue: a2 }

        case 1: // RG# - Yellow
            return { red: 255, green: 255, blue: a1 }

        case 2: // R#B - Purple
            return { red: 255, green: a1, blue: 255 }

        case 3: // #G# - Green
            return { red: a1, green: 255, blue: a2 }

        case 4: // #GB - Cyan
            return { red: a1, green: 255, blue: 255 }

        case 5: // ##B - Blue;
            return { red: a1, green: a2, blue: 255 }

        default: // RGB - White;
            return { red: 255, green: 255, blue: 255 }
    }
}

export default (bounds: MinMax, changeChance: number) : Aspect<RGB> => {
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
