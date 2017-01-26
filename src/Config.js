/* eslint-disable valid-typeof */
/* eslint-disable no-restricted-syntax */

import { util } from './helpers/utils';


export default class Config {
    constructor(token) {
        this.current = {};
        this.initOnly = Config.initChecks();
        this.defaults = Config.initDefaults();

        this.initCurrent(token);
    }

    static initChecks() {
        return {
            cookie: true,
            enabled: true,
            token: true,
            callback: {
                enabled: true
            },
            console: {
                enabled: true
            },
            network: {
                enabled: true
            },
            visitor: {
                enabled: true
            },
            window: {
                enabled: true,
                promise: true
            }
        };
    }

    static initDefaults() {
        return {
            application: '',
            cookie: false,
            enabled: true,
            errorURL: 'https://foozlejs.com/capture',
            errorNoSSLURL: 'http://foozlejs.com/capture',
            faultURL: 'http://foozlejs.com/fault.gif',
            onError() {
                return true;
            },
            serialize(obj) {
                if (obj && typeof obj === 'string') {
                    return obj;
                }

                if (typeof obj === 'number' && isNaN(obj)) {
                    return 'NaN';
                }

                if (obj === '') {
                    return 'Empty String';
                }

                let jsonObj;
                try {
                    jsonObj = JSON.stringify(obj);
                } catch (c) {
                    jsonObj = 'Unserializable Object';
                }

                if (jsonObj) {
                    return jsonObj;
                }

                if (obj === undefined) {
                    return 'undefined';
                }

                if (obj && obj.toString) {
                    return obj.toString();
                }

                return 'unknown';
            },
            sessionId: '',
            token: '',
            userId: '',
            version: '',
            callback: {
                enabled: true,
                bindStack: false
            },
            console: {
                enabled: true,
                display: true,
                error: true,
                warn: false,
                watch: ['log', 'debug', 'info', 'warn', 'error']
            },
            network: {
                enabled: true,
                error: true
            },
            visitor: {
                enabled: true
            },
            usageURL: 'http://foozlejs.com/usage.gif',
            window: {
                enabled: true,
                promise: true
            }
        };
    }

    initCurrent(options) {
        if (this.validate(options, this.defaults, 'config', {})) {
            this.current = util.extend(this.current, this.defaults, options);
            return true;
        }
        this.current = util.extend(this.current, this.defaults);
        return false;
    }

    setCurrent(obj) {
        if (this.validate(obj, this.defaults, 'config', this.initOnly)) {
            this.current = util.extend(this.current, obj);
            return true;
        }
        return false;
    }

    validate(obj, attr, value, type) {
        let result = true;
        value = value || '';
        type = type || {};

        for (const i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (attr.hasOwnProperty(i)) {
                    const error = typeof attr[i];

                    if (typeof obj[i] !== error) {
                        console.warn(`${value}.${i}: property must be type ${error}.`);
                        result = false;
                    } else if (Object.prototype.toString.call(obj[i]) !== '[object Array]' ||
                                Config.validateArray(obj[i], attr[i], `${value}.${i}`)) {
                        if (Object.prototype.toString.call(obj[i]) === '[object Object]') {
                            result = this.validate(obj[i], attr[i], `${value}.${i}`, type[i]);
                        } else if (type.hasOwnProperty(i)) {
                            console.warn(`${value}.${i}: property cannot be set after load.`);
                            result = false;
                        }
                    } else {
                        result = false;
                    }

                } else {
                    console.warn(`${value}.${i}: property not supported.`);
                    result = false;
                }
            }
        }
        return result;
    }

    static validateArray(obj, name, prefix) {
        let ret = true;
        prefix = prefix || '';
        for (let i = 0; i < obj.length; i += 1) {
            if (!util.contains(name, obj[i])) {
                console.warn(`${prefix}[${i}]: invalid value: ${obj[i]}.`);
                ret = false;
            }
        }
        return ret;

    }
}
