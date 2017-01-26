import { util } from './helpers/utils';


export default class Log {
    constructor() {
        this.appender = [];
        this.maxLength = 30;
    }

    all(xs) {
        const result = [];
        let cursor;
        let i;

        for (i = 0; i < this.appender.length; i += 1) {
            cursor = this.appender[i];
            if (cursor.category === xs) {
                result.push(cursor.value);
            }
        }
        return result;
    }

    clear() {
        this.appender.length = 0;
    }

    truncate() {
        if (this.appender.length > this.maxLength) {
            this.appender = this.appender.slice(Math.max(this.appender.length - this.maxLength, 0));
        }
    }

    add(category, obj) {
        const id = util.uuid();

        this.appender.push({
            key: id,
            value: obj,
            category
        });

        this.truncate();
        return id;
    }

    get(r, token) {
        let c;
        let i;
        for (i = 0; i < this.appender.length; i += 1) {
            c = this.appender[i];
            if (c.category === r && c.key === token) {
                return c.value;
            }
        }
        return false;
    }
}
