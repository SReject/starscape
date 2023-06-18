const TimingFactory = (callback, halfed = false) => (delta, start, end, ...meta) => {
    if (halfed) {
        delta = 2 * (delta < 0.5 ? delta : (1 - delta));
    }
    return callback(delta, end - start, ...meta) + start;
};
const linearFnc = (delta, range) => delta * range;
const pulseFnc = (delta, range, severity) => {
    // TODO: progression speeds up
    //       linear progression for now
    return delta * range;
};
const jumpFnc = (delta, range, severity) => {
    // TODO: progression slows down
    //       linear progression for now
    return delta * range;
};
const timingFunctions = Object.freeze({
    linear: TimingFactory(linearFnc),
    linearInOut: TimingFactory(linearFnc, true),
    pulse: TimingFactory(pulseFnc),
    pulseInOut: TimingFactory(pulseFnc, true),
    jump: TimingFactory(jumpFnc),
    jumpInOut: TimingFactory(jumpFnc, true),
});
export default timingFunctions;
export const getTimingFunction = (type) => {
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
};
export const getRandomTimingFunction = (disposition = 'inonly') => {
    let keys;
    if (disposition === 'any') {
        keys = Object.keys(timingFunctions);
    }
    else if (disposition === 'inonly') {
        keys = Object.keys(timingFunctions).filter(key => !key.endsWith('InOut'));
    }
    else {
        keys = Object.keys(timingFunctions).filter(key => key.endsWith('InOut'));
    }
    return timingFunctions[keys[Math.floor(Math.random() * keys.length)]];
};
