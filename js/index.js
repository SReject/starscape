import Starscape from './starscape.js';
const canvas = (document.getElementById('starscape'));
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
globalThis.starscape = new Starscape({
    canvas: canvas,
    stars: 500,
    bounds: {
        lifespan: {
            min: 3000,
            max: 10000
        },
        size: { min: 0, max: 2.5 },
        rotate: 3,
        color: { min: 64, max: 192 },
        brilliance: { min: 0, max: 1 },
        changeChance: {
            move: 0.025,
            resize: 1,
            recolor: 0.5
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
