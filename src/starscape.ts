import Star, { StarOptions } from './star/star.js';
import {
    default as resolveChangeChance,
    type ChangeChance
} from './util/change-chance.js';

import {
    default as resolveMinMax,
    type MinMax
} from './util/resolve-min-max.js';


interface StarscapeOptions {

    /** Canvas element to draw to */
    canvas: HTMLCanvasElement;

    /** Number of stars to maintain */
    stars: number;

    /** Aspect bounds for each star */
    bounds: {

        /** How long the star will last */
        lifespan: MinMax;

        /** The bounds of the star's size */
        size: MinMax;

        /** How many full rotations the star can go through */
        rotate: MinMax;

        /** RGB color ranges */
        color: MinMax;

        /** The brightness of the star */
        brilliance: MinMax;

        /** Chance for aspects of the star to change */
        changeChance?: ChangeChance;
    },

    /** Max FPS; < 1: no limit */
    fps?: number;

    /** HTML element to draw fps count to; false to disable */
    fpsCounter?: false | HTMLElement;

    /** How fast the the engine runs: 0 < slower < 1 (default) < faster */
    speed?: number;

    /** Auto start */
    start?: boolean;
}

export default class Starscape {

    private _canvas : { element: HTMLCanvasElement, ctx: CanvasRenderingContext2D };
    private _starOptions: StarOptions;
    private _stars : Star[] = [];
    private _fps: number;
    private _fpsCounter: false | HTMLElement;
    private _speed: number;

    private _animationFrameId?: number;
    private _lastTimestamp: number;

    private _endOfLife : boolean = false;

    constructor(options: StarscapeOptions) {
        const { canvas, stars, bounds, fps, speed, start } = options;

        this._canvas = {
            element: canvas,
            ctx: canvas.getContext('2d')
        };

        this._starOptions = {
            canvas: {
                width: canvas.clientWidth,
                height: canvas.clientHeight
            },
            lifeSpan: resolveMinMax(bounds.lifespan),
            size: resolveMinMax(bounds.size),
            rotate: resolveMinMax(bounds.rotate),
            color: resolveMinMax(bounds.color),
            brillance: resolveMinMax(bounds.brilliance),
            changeChance: resolveChangeChance(bounds.changeChance)
        };

        for (let i = 0; i < stars; i += 1) {
            this._stars.push(new Star(this._starOptions));
        }

        if (fps > 0) {
            this._fps = fps / 1000;
        } else {
            this._fps = 0;
        }

        if (options.fpsCounter) {
            this._fpsCounter = options.fpsCounter;
        } else {
            this._fpsCounter = false;
        }

        this._speed = speed || 1;

        if (start) {
            this.start();
        }
    }

    start() {
        if (this._endOfLife === true) {
            this.end();
            throw new Error('end of life');
        }
        if (this._animationFrameId) {
            return;
        }

        this._animationFrameId = requestAnimationFrame((timestamp: number) => this.tick(timestamp));
    }

    tick(timestamp: number) {
        if (this._endOfLife === true) {
            this.end();
            throw new Error('end of life');
        }

        this._animationFrameId = requestAnimationFrame((timestamp: number) => this.tick(timestamp));

        // Limit FPS
        if (this._lastTimestamp) {
            if (this._fps > 0 && (timestamp - this._lastTimestamp) < this._fps) {
                this._lastTimestamp = timestamp;
                return;
            } else if (this._fpsCounter) {
                this._fpsCounter.innerText = String(Math.floor(1000 / (timestamp - this._lastTimestamp)));
            }
        }

        this._lastTimestamp = timestamp;

        const { width, height } = this._canvas.element;
        const ctx = this._canvas.ctx;

        // clear canvas
        ctx.clearRect(0, 0, width, height);

        this._stars = this._stars.map((star: Star) : Star => {

            // update/replace star:
            star.update(
                timestamp,
                () => { star = new Star(this._starOptions); },
                this._speed
            );

            const { position, size, rotation, color, brilliance } = star;

            // TODO: Improve star drawing
            ctx.beginPath();
            ctx.arc(position.x, position.y, size, 0, 2 * Math.PI, false);
            ctx.fillStyle = `rgba(${color.red}, ${color.green}, ${color.blue}, ${brilliance})`;
            ctx.shadowColor = `rgb(${color.red}, ${color.green}, ${color.blue})`;

            ctx.fill();

            return star;
        });
    };

    end() {
        if (this._animationFrameId) {
            cancelAnimationFrame(this._animationFrameId);
        }
        this._canvas = null;
        this._starOptions = null;
        this._stars = null;
        this._fps = null;
        this._fpsCounter = null;
        this._speed = null;
        this._animationFrameId = null;
        this._lastTimestamp = null;
        this._endOfLife = true
    }
}