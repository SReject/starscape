export type MinMax = number | { min?: number, max: number };

/** Realized min-max value */
export type ResolvedMinMax = { min: number, max: number };

/** Quantifies a min-max value */
export default (value: MinMax) : ResolvedMinMax => {
    if (typeof value === 'number') {
        return {min: value, max: value};
    }
    return {
        min: value.min || 0,
        max: value.max
    }
};