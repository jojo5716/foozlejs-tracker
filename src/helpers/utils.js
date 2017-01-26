/* eslint-disable func-names */
/* eslint-disable prefer-rest-params */
/* eslint-disable max-len */
/* eslint-disable no-bitwise */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-mixed-operators */

import { InitWatcher } from './initWatcher';
import { MetadataReport } from './metaDataReport';

const util = (() => ({
    bind(v, self) {
        return function () {
            return v.apply(self, Array.prototype.slice.call(arguments));
        };
    },

    contains(x, callback) {
        let i;
        for (i = 0; i < x.length; i += 1) {
            if (x[i] === callback) return true;
        }
        return false;
    },

    defer(context, frame) {
        setTimeout(() => {
            context.apply(frame);
        });
    },

    extend(target) {
        const args = Array.prototype.slice.call(arguments, 1);

        for (let i = 0; i < args.length; i += 1) {
            for (const key in args[i]) {
                if (args[i][key] === null || args[i][key] === undefined) {
                    target[key] = args[i][key];
                } else if (Object.prototype.toString.call(args[i][key]) === '[object Object]') {
                    target[key] = target[key] || {};
                    this.extend(target[key], args[i][key]);
                } else {
                    target[key] = args[i][key];
                }
            }
        }
        return target;
    },

    hasFunction(has, name) {
        try {
            return !!has[name];
        } catch (c) {
            return false;
        }
    },

    isBoolean(object) {
        return object === true || object === false;
    },

    isBrowserIE(m = window.navigator.userAgent) {
        const match = m.match(/Trident\/([\d.]+)/);

        if (match && match[1] === '7.0') {
            m = 11;
        } else if (m.match(/MSIE ([\d.]+)/)) {
            m = parseInt(m[1], 10);
        } else {
            m = false;
        }
        return m;
    },

    isBrowserSupported() {
        const hasMinimumVersion = this.isBrowserIE();
        return !hasMinimumVersion || hasMinimumVersion >= 8;
    },

    isFunction(actual) {
        return !(!actual || typeof actual !== 'function');
    },

    isObject(obj) {
        return !(!obj || typeof obj !== 'object');
    },

    isWrappableFunction(value) {
        return this.isFunction(value) && this.hasFunction(value, 'apply');
    },

    isoNow() {
        const d = new Date();
        if (d.toISOString) {
            return d.toISOString();
        }
        return `${d.getUTCFullYear()}-${this.pad(d.getUTCMonth() + 1)}-${this.pad(d.getUTCDate())}T${this.pad(d.getUTCHours())}:${this.pad(d.getUTCMinutes())}:${this.pad(d.getUTCSeconds())}.${String((d.getUTCMilliseconds() / 1e3).toFixed(3)).slice(2, 5)}Z`;
    },

    pad(val) {
        val = String(val);
        if (val.length === 1) {
            val = `0${val}`;
        }
        return val;
    },

    testCrossdomainXhr() {
        return 'withCredentials' in new XMLHttpRequest();
    },

    uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const a = 16 * Math.random() | 0;
            return (c === 'x' ? a : a & 3 | 8).toString(16);
        });
    },

    wrapError(e) {
        if (e.innerError) return e;
        const error = Error(`FoozleJS Caught: ${e.message || e}`);
        error.description = `FoozleJS Caught: ${e.description}`;
        error.file = e.file;
        error.line = e.line || e.lineNumber;
        error.column = e.column || e.columnNumber;
        error.stack = e.stack;
        error.innerError = e;
        return error;
    }
}))();

module.exports = {
    util,
    MetadataReport,
    InitWatcher
};
