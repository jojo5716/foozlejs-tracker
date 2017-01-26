/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-rest-params */

import { util } from './helpers/utils';


export default class NetworkWatcher {
    constructor(log, onError, onFault, window, options) {
        this.log = log;
        this.onError = onError;
        this.onFault = onFault;
        this.window = window;
        this.options = options;

        if (options.enabled) this.initialize(window);
    }

    initialize(win) {
        if (win.XMLHttpRequest && util.hasFunction(win.XMLHttpRequest.prototype.open, 'apply')) {
            this.watchNetworkObject(win.XMLHttpRequest);
        }

        if (win.XDomainRequest && util.hasFunction(win.XDomainRequest.prototype.open, 'apply')) {
            this.watchNetworkObject(win.XDomainRequest);
        }
    }

    watchNetworkObject(XHR) {
        const self = this;
        const openXHR = XHR.prototype.open;
        const sendopenXHR = XHR.prototype.send;

        XHR.prototype.open = function (method, url) {
            const uri = (url || '').toString();

            if (!uri.includes('localhost:0')) {
                this._foozlejs = {
                    method,
                    url: uri
                };
            }
            return openXHR.apply(this, arguments);
        };

        XHR.prototype.send = function () {
            try {
                if (!this._foozlejs) {
                    return sendopenXHR.apply(this, arguments);
                }

                this._foozlejs.logId = self.log.add('n', {
                    startedOn: util.isoNow(),
                    method: this._foozlejs.method,
                    url: this._foozlejs.url
                });
                self.listenForNetworkComplete(this);
            } catch (buffer) {
                self.onFault(buffer);
            }
            return sendopenXHR.apply(this, arguments);
        };
        return XHR;
    }

    listenForNetworkComplete(obj) {
        const self = this;
        if (this.window.ProgressEvent && obj.addEventListener) {
            obj.addEventListener('readystatechange', () => {
                if (obj.readyState === 4) {
                    self.finalizeNetworkEvent(obj);
                }
            }, true);
        }

        if (obj.addEventListener) {
            obj.addEventListener('load', () => {
                self.finalizeNetworkEvent(obj);
                self.checkNetworkFault(obj);
            }, true);
        } else {
            setTimeout(() => {
                try {
                    const objOnload = obj.onload;
                    obj.onload = function () {
                        self.finalizeNetworkEvent(obj);
                        self.checkNetworkFault(obj);

                        if (typeof objOnload === 'function' && util.hasFunction(objOnload, 'apply')) {
                            objOnload.apply(obj, arguments);
                        }
                    };

                    const objOnerror = obj.onerror;
                    obj.onerror = function () {
                        self.finalizeNetworkEvent(obj);
                        self.checkNetworkFault(obj);

                        if (typeof oldOnError === 'function') {
                            objOnerror.apply(obj, arguments);
                        }
                    };
                } catch (buffer) {
                    self.onFault(buffer);
                }
            }, 0);
        }
    }

    finalizeNetworkEvent(xhr) {
        if (xhr._foozlejs) {
            const obj = this.log.get('n', xhr._foozlejs.logId);

            if (obj) {
                obj.completedOn = util.isoNow();
                obj.statusCode = xhr.status === 1223 ? 204 : xhr.status;
                obj.statusText = xhr.status === 1223 ? 'No Content' : xhr.statusText;
            }
        }
    }

    checkNetworkFault(req) {
        if (this.options.error && req.status >= 400 && req.status !== 1223) {
            const settings = req._foozlejs || {};
            this.onError('ajax', `${req.status} ${req.statusText}: ${settings.method} ${settings.url}`);
        }
    }

    report() {
        return this.log.all('n');
    }
}
