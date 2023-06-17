import {
    type ChangeChanceList
} from '../../util/change-chance.js';

import { type Aspect } from './aspect.js'

import {
    default as generatePosition,
    type Position as StarPosition
} from './generate-position-aspect.js';

import {
    default as generateAspect,
    generateFader,
    type Bounds
} from './generate-aspect.js';

export interface StarAspectsOptions {
    canvas: {
        width: number;
        height: number;
    };

    size: Bounds;
    rotate: Bounds;
    brillance: Bounds;

    changeChance: ChangeChanceList;
}

export default class StarAspects {

    private _position :  Aspect<StarPosition>;
    private _size :      Aspect<number>;
    private _rotation :  Aspect<number>;
    private _brilliance: Aspect<number>;

    constructor(options: StarAspectsOptions) {
        const { move, resize, rotate, brighten } = options.changeChance;

        this._position   = generatePosition(options.canvas, move);
        this._size       = generateAspect(options.size, resize);
        this._rotation   = generateAspect(options.rotate, rotate);
        this._brilliance = generateFader(options.brillance, 1);
    }

    get position() : StarPosition {
        return this._position.value;
    }
    get size() : number {
        return this._size.value;
    }
    get rotation() : number {
        return this._rotation.value;
    }
    get brilliance() : number {
        return this._brilliance.value;
    }

    update(delta: number) {
        this._position.update(delta);
        this._size.update(delta);
        this._rotation.update(delta);
        this._brilliance.update(delta);
    }
}