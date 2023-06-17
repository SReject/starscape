import {
    default as StarAspects,
    type StarAspectsOptions
} from './star-aspects/star-aspects.js';

type DispatchFnc = (target: Star, ...args: unknown[]) => void;

export interface StarOptions extends StarAspectsOptions {
    lifeSpan: {
        min: number;
        max: number;
    };
}

export default class Star {

    private _aspects?: StarAspects;
    private _lifeSpan?: number;
    private _startTime?: number;
    private _endOfLife: boolean = false;

    constructor(options: StarOptions) {
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
    get brilliance() {
        return this._aspects.brilliance;
    }
    get aspects() {
        return {
            position: this.position,
            size: this.size,
            rotation: this.rotation,
            brilliance: this.brilliance
        }
    }

    update(timestamp: number, dispatch: DispatchFnc, speed: number = 1) {
        if (this._endOfLife === true) {
            throw new Error('star was dispatched');
        }

        if (!this._startTime) {
            this._startTime = timestamp;
        }

        // end of life :'(
        const delta = (timestamp - this._startTime) * speed / (<number>this._lifeSpan);
        if (delta > 1) {
            this.end();
            dispatch(this);
            return;
        }
        this._aspects?.update(delta);
    }

    end() {
        this._endOfLife = true;
        delete this._aspects;
        delete this._lifeSpan;
        delete this._startTime;
    }
}