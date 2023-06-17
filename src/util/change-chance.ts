export interface ChangeChanceList {
    move: number,
    resize: number,
    rotate: number,
    recolor: number,
    brighten: number,
    reshape: number
}

const noChance : ChangeChanceList = {
    move: 0,
    resize: 0,
    rotate: 0,
    recolor: 0,
    brighten: 0,
    reshape: 0
};

const defaultChance : ChangeChanceList = (() : ChangeChanceList => {
    const defaults : Partial<typeof noChance> = {};
    Object.keys(noChance).forEach(key => {
        defaults[key] = 0.1;
    });
    return <ChangeChanceList>defaults;
})();

export type ChangeChance = false | Number | Partial<ChangeChanceList>;

export default (changeChance?: ChangeChance) : ChangeChanceList => {

    if (changeChance == null) {
        return { ...defaultChance };
    }

    if (changeChance === false) {
        return { ...noChance };
    }

    if (typeof changeChance === 'number') {
        const result : Partial<typeof noChance> = {};
        Object.keys(noChance).forEach(key => {
            result[key] = changeChance;
        });
        return <ChangeChanceList>result;
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
}