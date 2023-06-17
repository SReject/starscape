import Star, { StarOptions } from './star/star.js';
import {
    default as resolveChangeChance,
    type ChangeChance
} from './util/change-chance.js';


type MinMax = number | { min?: number, max: number };

interface StarscapeOptions {
    canvas: HTMLCanvasElement;

    stars: number;

    bounds: {
        lifespan: MinMax;
        size: MinMax;
        rotate: MinMax;
        brilliance: MinMax;
        changeChance?: ChangeChance;
    },

    speed?: number;

    start?: boolean;
}

const resolveMinMax = (value: MinMax) : {min: number, max: number} => {
    if (typeof value === 'number') {
        return {min: value, max: value};
    }
    return {
        min: value.min || 0,
        max: value.max
    }
};

export default class Starscape {
    private _stars : Star[] = [];

    private _animationFrameId?: number;
    private _endOfLife : boolean = false;

    private _starOptions: StarOptions;

    private _canvas : { element: HTMLCanvasElement, ctx: CanvasRenderingContext2D };
    private _speed: number;

    constructor(options: StarscapeOptions) {
        const { canvas, stars, bounds, speed, start } = options;

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
            brillance: resolveMinMax(bounds.brilliance),
            changeChance: resolveChangeChance(bounds.changeChance)
        };

        for (let i = 0; i < stars; i += 1) {
            this._stars.push(new Star(this._starOptions));
        }

        this._speed = speed || 1;

        if (start) {
            this.start();
        }
    }
    start() {
        if (this._endOfLife === true) {
            throw new Error('end of life');
        }
        if (this._animationFrameId) {
            return;
        }

        this._animationFrameId = requestAnimationFrame((timestamp: number) => this.tick(timestamp));
    }
    tick(timestamp: number) {
        if (this._endOfLife === true) {
            throw new Error('end of life');
        }
        this._animationFrameId = requestAnimationFrame((timestamp: number) => this.tick(timestamp));

        // clear canvas
        const { width, height } = this._canvas.element;
        const ctx = this._canvas.ctx;

        ctx.clearRect(0, 0, width, height);

        // update and draw each new star
        this._stars = this._stars.map((star: Star) : Star => {

            // update/replace star:
            star.update(
                timestamp,
                () => { star = new Star(this._starOptions); },
                this._speed
            );

            const { position, size, rotation, brilliance } = star;


            // TODO: Improve star drawing
            ctx.beginPath();
            ctx.arc(position.x, position.y, size, 0, 2 * Math.PI, false);
            ctx.fillStyle = `rgba(255, 255, 255, ${brilliance})`
            ctx.fill();


            return star;
        });
    }
}
