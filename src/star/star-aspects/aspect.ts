import {
    getTimingFunction,
    type SupportedTimingFunctions,
    type TimingFunction,
} from './timing-functions.js'

export class Aspect<T> {
    protected current : T;
    constructor(current: T) {
        this.current = current;

    }
    get value() : T {
        return this.current;
    }
    update(...args: unknown[]) : T {
        return this.current;
    }
}

type TimingHandler = (a: number, b: number) => number;
type TraverseAspect<T> = (start: T, end: T, callback: TimingHandler) => T;

interface DynamicAspectOptions<T> {
    start: T;
    end: T;

    severity?: number;
    traverse?: (start: T, end: T, callback: TimingHandler) => T;
    updater?: SupportedTimingFunctions | TimingFunction;
}

export class DynamicAspect<T> extends Aspect<T> {
    private start : T;
    private end: T;

    private severity: number;
    private traverse: TraverseAspect<T>;

    private updater: TimingFunction;

    constructor(options: DynamicAspectOptions<T>) {
        super(options.start);

        this.start = options.start;
        this.end = options.end;

        this.severity = options.severity || 0.5;

        if (options.traverse) {
            this.traverse = options.traverse;

        } else {
            this.traverse = (start: T, end: T, callback: TimingHandler) => <T>callback(<number>start, <number>end);
        }
        this.updater = getTimingFunction(options.updater);
    }

    update(delta: number) : T {
        this.current = this.traverse(
            this.start,
            this.end,
            (start: number, end: number) => this.updater(delta, start, end, this.severity)
        );
        return this.current;
    }
}