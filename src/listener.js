/* eslint-disable func-names */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */

import Stack from './Stack';
import { util } from './helpers/utils';

export default class Listener {
    constructor(onError, onFault, options, config) {
        this.onError = onError;
        this.onFault = onFault;
        this.options = options;
        if (config.enabled) this.initialize(options);
    }

    initialize(win) {
        if (win.addEventListener) {
            this.wrapAndCatch(win.Element.prototype, 'addEventListener', 1);
            this.wrapAndCatch(win.XMLHttpRequest.prototype, 'addEventListener', 1);
            this.wrapRemoveEventListener(win.Element.prototype);
            this.wrapRemoveEventListener(win.XMLHttpRequest.prototype);
        }

        this.wrapAndCatch(win, 'setTimeout', 0);
        this.wrapAndCatch(win, 'setInterval', 0);
    }

    wrapAndCatch(proto, name, i) {
        const self = this;
        const method = proto[name];

        if (util.isWrappableFunction(method)) {
            proto[name] = function () {
                try {
                    const args = Array.prototype.slice.call(arguments);
                    const callback = args[i];
                    let options;
                    let fn;

                    if (self.options.bindStack) {
                        try {
                            throw Error();
                        } catch (e) {
                            fn = e.stack;
                            options = self.util.isoNow();
                        }
                    }

                    const bind = function () {
                        try {
                            if (util.isObject(callback)) {
                                return callback.handleEvent(...arguments);
                            }

                            if (util.isFunction(callback)) {
                                return callback.apply(this, arguments);
                            }
                        } catch (err) {
                            throw (
                                self.onError('catch', err, {
                                    bindTime: options,
                                    bindStack: fn
                                }), util.wrapError(err));
                        }

                        return null;
                    };

                    if (name === 'addEventListener') {
                        if (!this._foozlejsEvt) {
                            this._foozlejsEvt = new Stack();
                            this._foozlejsEvt.get(args[0], callback, args[2]);
                            return;
                        }
                    }

                    try {
                        if (callback) {
                            util.isWrappableFunction(callback);
                            util.isWrappableFunction(callback.handleEvent);
                            args[i] = bind;

                            if (name === 'addEventListener') {
                                this._foozlejsEvt.add(args[0], callback, args[2], args[i]);
                            }

                        }
                    } catch (e) {
                        return method.apply(this, arguments);
                    }
                    return method.apply(this, args);
                } catch (e) {
                    proto[name] = method;
                    self.onFault(e);
                }
            };
        }
    }

    wrapRemoveEventListener(doc) {

        if (doc && doc.removeEventListener && util.hasFunction(doc.removeEventListener, 'call')) {
            const func = doc.removeEventListener;
            doc.removeEventListener = function (a, b, callback) {
                if (this._foozlejsEvt) {
                    const foozlejsEvt = this._foozlejsEvt.get(a, b, callback);
                    if (foozlejsEvt) {
                        this._foozlejsEvt.remove(a, b, callback);
                    }
                    return func.call(this, a, foozlejsEvt, callback);
                }
                return func.call(this, a, b, callback);
            };
        }
    }
}
