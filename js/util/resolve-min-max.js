/** Quantifies a min-max value */
export default (value) => {
    if (typeof value === 'number') {
        return { min: value, max: value };
    }
    return {
        min: value.min || 0,
        max: value.max
    };
};
