import { default as StarAspects } from './star-aspects/star-aspects.js';
export default class Star {
    _aspects;
    _lifeSpan;
    _startTime;
    _endOfLife = false;
    constructor(options) {
        this._aspects = new StarAspects(options);
        const { min, max } = options.lifeSpan;
        this._lifeSpan = (max - min) * Math.random() + min;
    }
    get position() {
        return this._aspects.position;
    }
    get size() {
        return this._aspects.size;
    }
    get rotation() {
        return this._aspects.rotation;
    }
    get color() {
        return this._aspects.color;
    }
    get brilliance() {
        return this._aspects.brilliance;
    }
    get aspects() {
        return {
            position: this.position,
            size: this.size,
            rotation: this.rotation,
            color: this.color,
            brilliance: this.brilliance
        };
    }
    update(timestamp, 
    /** Called when the star has reached its end of life */
    dispatch, 
    /** The speed at which time is moving */
    speed = 1) {
        if (this._endOfLife === true) {
            throw new Error('star was dispatched');
        }
        if (!this._startTime) {
            this._startTime = timestamp;
        }
        // end of life :'(
        const delta = (timestamp - this._startTime) * speed / this._lifeSpan;
        if (delta > 1) {
            this.end();
            dispatch(this);
            return;
        }
        this._aspects?.update(delta);
    }
    end() {
        this._aspects = null;
        this._lifeSpan = null;
        this._startTime = null;
        this._endOfLife = true;
    }
}
