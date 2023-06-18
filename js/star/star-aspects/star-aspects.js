import { default as generatePosition } from './generate-position-aspect.js';
import { default as generateAspect, generateFader } from './generate-aspect.js';
import { default as generateColor } from './generate-color.js';
export default class StarAspects {
    _position;
    _size;
    _rotation;
    _color;
    _brilliance;
    constructor(options) {
        const { move, resize, rotate, recolor, brighten } = options.changeChance;
        this._position = generatePosition(options.canvas, move);
        this._size = generateAspect(options.size, resize);
        this._rotation = generateAspect(options.rotate, rotate);
        this._color = generateColor(options.color, recolor);
        this._brilliance = generateFader(options.brillance, 1);
    }
    get position() {
        return this._position.value;
    }
    get size() {
        return this._size.value;
    }
    get rotation() {
        return this._rotation.value;
    }
    get color() {
        return this._color.value;
    }
    get brilliance() {
        return this._brilliance.value;
    }
    update(delta) {
        this._position.update(delta);
        this._size.update(delta);
        this._rotation.update(delta);
        this._color.update(delta);
        this._brilliance.update(delta);
    }
}
