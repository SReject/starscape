const noChance = {
    move: 0,
    resize: 0,
    rotate: 0,
    recolor: 0,
    brighten: 0,
    reshape: 0
};
const defaultChance = (() => {
    const defaults = {};
    Object.keys(noChance).forEach(key => {
        defaults[key] = 0.1;
    });
    return defaults;
})();
/** Resolves input to a realized ChangeChanceList */
export default (changeChance) => {
    if (changeChance == null) {
        return { ...defaultChance };
    }
    if (changeChance === false) {
        return { ...noChance };
    }
    if (typeof changeChance === 'number') {
        const result = {};
        Object.keys(noChance).forEach(key => {
            result[key] = changeChance;
        });
        return result;
    }
    const result = { ...defaultChance };
    Object
        .keys(result)
        .forEach(key => {
        const value = changeChance[key];
        if (value == null) {
            return;
        }
        if (value === false) {
            result[key] = 0;
        }
        if (typeof value !== 'number') {
            throw new Error('invalid change chance entry');
        }
        result[key] = value;
    });
    return result;
};
