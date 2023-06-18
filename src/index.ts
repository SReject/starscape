import Starscape from './starscape.js';

const canvas = <HTMLCanvasElement>(document.getElementById('starscape'));
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

globalThis.starscape = new Starscape({
    canvas: canvas,
    stars: 100,
    bounds: {
        lifespan: {
            min: 3000,
            max: 10000
        },
        size: {
            min: 0,
            max: 5
        },
        rotate: 3,
        color: {
            red: {
                min: 224,
                max: 255
            },
            green: {
                min: 224,
                max: 255
            },
            blue: {
                min: 224,
                max: 255
            }
        },
        brilliance: {
            min: 0,
            max: 1
        },
        changeChance: {
            move: 0.025,
            resize: 1
        }
    },
    speed: 1,
    fps: -1,
    fpsCounter: document.getElementById('fps-counter'),
    start: true
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});