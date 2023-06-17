export interface ChangeChanceList {

    /* chance the star will move */
    move: number,

    /* chance the star will change size */
    resize: number,

    /* chance the star will rotate */
    rotate: number,

    /* chance the star will change color */
    recolor: number,

    /* chance the star will brighten */
    brighten: number,

    /* chance the star will change shape */
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

/** Chance that an aspect will by dynamic/change */
export type ChangeChance = false | Number | Partial<ChangeChanceList>;

/** Resolves input to a realized ChangeChanceList */
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