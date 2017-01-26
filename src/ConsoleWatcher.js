/* eslint-disable func-names */
/* eslint-disable prefer-rest-params */

import { util } from './helpers/utils';


export default class ConsoleWatcher {
    constructor(log, onError, onFault, serialize, win, con) {
        this.log = log;
        this.onError = onError;
        this.onFault = onFault;
        this.serialize = serialize;
        if (con.enabled) {
            win.console = this.wrapConsoleObject(win.console, con);
        }
    }

    wrapConsoleObject(proto = {}, obj) {
        const socket = proto.log || (() => {});
        const self = this;
        let i;

        for (i = 0; i < obj.watch.length; i += 1) {
            (((name) => {
                const fn = proto[name] || socket;

                proto[name] = function () {
                    try {
                        const args = Array.prototype.slice.call(arguments);

                        self.log.add('c', {
                            timestamp: util.isoNow(),
                            severity: name,
                            message: self.serialize(args.length === 1 ? args[0] : args)
                        });

                        if ((obj.error && name === 'error') || (obj.warn && name === 'warn')) {
                            try {
                                throw Error(self.serialize(args.length === 1 ? args[0] : args));
                            } catch (buffer) {
                                self.onError('console', buffer);
                            }
                        }
                        if (obj.display && util.hasFunction(fn, 'apply')) {
                            fn.apply(this, args);
                        } else {
                            fn(args[0], args[1], args[2]);
                        }
                    } catch (buffer) {
                        self.onFault(buffer);
                    }
                };
            }))(obj.watch[i]);
        }
        return proto;
    }

    report() {
        return this.log.all('c');
    }
}
