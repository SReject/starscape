const TimingFactory = (
    callback: (delta: number, range: number, ...meta: any[]) => number,
    halfed: boolean = false
) => (delta: number, start: number, end: number, ...meta: unknown[]) : number => {
    if (halfed) {
        delta = 2 * (delta < 0.5 ? delta : (1 - delta));
    }

    return callback(delta, end - start, ...meta) + start;
};

const linearFnc = (delta: number, range: number) : number => delta * range;

const pulseFnc = (delta: number, range: number, severity: number) : number => {
    // TODO: progression speeds up
    //       linear progression for now
    return delta * range;
}

const jumpFnc = (delta: number, range: number, severity: number) : number => {
    // TODO: progression slows down
    //       linear progression for now
    return delta * range;
}

const timingFunctions = Object.freeze({
    linear:      TimingFactory(linearFnc),
    linearInOut: TimingFactory(linearFnc, true),
    pulse:       TimingFactory(pulseFnc),
    pulseInOut:  TimingFactory(pulseFnc, true),
    jump:        TimingFactory(jumpFnc),
    jumpInOut:   TimingFactory(jumpFnc, true),
});

export default timingFunctions;

export type SupportedTimingFunctions = keyof typeof timingFunctions;

export type TimingFunction = (
    delta: number,
    start: number,
    end: number,
    severity?: number
) => number;

export const getTimingFunction = (type?: SupportedTimingFunctions | TimingFunction) : TimingFunction => {
    if (type == null) {
        return timingFunctions['linearInOut'];
    }
    if (typeof type === 'string') {
        return timingFunctions[type];
    }
    if (typeof type === 'function') {
        return type;
    }
    throw new Error('invalid timing function');
}

export const getRandomTimingFunction = (disposition: 'any' | 'inonly' | 'inout' = 'inonly') : TimingFunction => {

    let keys : string[];
    if (disposition === 'any') {
        keys = Object.keys(timingFunctions)
    } else if (disposition === 'inonly') {
        keys = Object.keys(timingFunctions).filter(key => !key.endsWith('InOut'));
    } else {
        keys = Object.keys(timingFunctions).filter(key => key.endsWith('InOut'));
    }

    return timingFunctions[
        keys[Math.floor(Math.random() * keys.length)]
    ];
}