import { getTimingFunction, } from './timing-functions.js';
export class Aspect {
    current;
    constructor(current) {
        this.current = current;
    }
    get value() {
        return this.current;
    }
    update(...args) {
        return this.current;
    }
}
export class DynamicAspect extends Aspect {
    start;
    end;
    severity;
    traverse;
    updater;
    constructor(options) {
        super(options.start);
        this.start = options.start;
        this.end = options.end;
        this.severity = options.severity || 0.5;
        if (options.traverse) {
            this.traverse = options.traverse;
        }
        else {
            this.traverse = (start, end, callback) => callback(start, end);
        }
        this.updater = getTimingFunction(options.updater);
    }
    update(delta) {
        this.current = this.traverse(this.start, this.end, (start, end) => this.updater(delta, start, end, this.severity));
        return this.current;
    }
}
