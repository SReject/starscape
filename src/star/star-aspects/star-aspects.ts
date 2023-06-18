import {
    type ChangeChanceList
} from '../../util/change-chance.js';

import { type Aspect } from './aspect.js'

import {
    default as generatePosition,
    type Position
} from './generate-position-aspect.js';

import {
    default as generateAspect,
    generateFader,
    type Bounds
} from './generate-aspect.js';

import {
    default as generateColor,
    type RGB
} from './generate-color.js';

export interface StarAspectsOptions {
    canvas: {
        width: number;
        height: number;
    };

    size: Bounds;
    rotate: Bounds;
    color: { red: Bounds, green: Bounds, blue: Bounds }
    brillance: Bounds;

    changeChance: ChangeChanceList;
}

export default class StarAspects {

    private _position:   Aspect<Position>;
    private _size:       Aspect<number>;
    private _rotation:   Aspect<number>;
    private _color:      Aspect<RGB>
    private _brilliance: Aspect<number>;

    constructor(options: StarAspectsOptions) {
        const { move, resize, rotate, recolor, brighten } = options.changeChance;

        this._position   = generatePosition(options.canvas, move);
        this._size       = generateAspect(options.size, resize);
        this._rotation   = generateAspect(options.rotate, rotate);
        this._color      = generateColor(options.color, recolor);
        this._brilliance = generateFader(options.brillance, 1);
    }

    get position() : Position {
        return this._position.value;
    }
    get size() : number {
        return this._size.value;
    }
    get rotation() : number {
        return this._rotation.value;
    }
    get color() : RGB {
        return this._color.value;
    }
    get brilliance() : number {
        return this._brilliance.value;
    }

    update(delta: number) {
        this._position.update(delta);
        this._size.update(delta);
        this._rotation.update(delta);
        this._color.update(delta);
        this._brilliance.update(delta);
    }
}