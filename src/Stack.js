import { util } from './helpers/utils';


export default class Stack {
    constructor() {
        this.events = [];
    }

    add(a, b, c, d) {
        if (this.indexOf(a, b, c) <= -1) {
            c = Stack.getEventOptions(c);
            this.events.push([a, b, c.capture, c.once, c.passive, d]);
        }
    }

    get(a, b, c) {
        a = this.indexOf(a, b, c);
        return a >= 0 ? this.events[a][5] : undefined;
    }

    static getEventOptions(value) {
        const object = {
            capture: false,
            once: false,
            passive: false
        };
        return util.isBoolean(value) ? util.extend(object, {
            capture: value
        }) : util.extend(object, value);
    }

    indexOf(fn, scope, options) {
        options = Stack.getEventOptions(options);
        for (let i = 0; i < this.events.length; i += 1) {
            const item = this.events[i];
            if (item[0] === fn &&
                item[1] === scope &&
                item[2] === options.capture &&
                item[3] === options.once &&
                item[4] === options.passive) {
                return i;
            }
        }
        return -1;
    }

    remove(a, b, c) {
        a = this.indexOf(a, b, c);
        if (a >= 0) this.events.splice(a, 1);
    }
}
