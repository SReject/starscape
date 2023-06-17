export type MinMax = number | { min?: number, max: number };

export default ((value: MinMax) : {min: number, max: number} => {
    if (typeof value === 'number') {
        return {min: value, max: value};
    }
    return {
        min: value.min || 0,
        max: value.max
    }
});