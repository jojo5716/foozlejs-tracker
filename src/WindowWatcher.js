/* eslint-disable max-params */
/* eslint-disable no-param-reassign */
/* eslint-disable complexity */
/* eslint-disable max-statements */

export default class WindowWatcher {
    constructor(onError, onFault, serialize, win, result) {
        this.onError = onError;
        this.onFault = onFault;
        this.serialize = serialize;
        if (result.enabled) this.watchWindowErrors(win);
        if (result.promise) this.watchPromiseErrors(win);
    }

    watchPromiseErrors(win) {
        if (win.addEventListener) {
            // If a promise is reject but there is no rejection handler
            win.addEventListener('unhandledrejection', (e) => {
                this.onError('window', (e || {}).reason);
            });
        }
    }


    watchWindowErrors(context) {
        const contextHandler = context.onerror || (() => {});
        const self = this;

        context.onerror = (errorMessage, host, width, height, stack) => {
            try {
                stack = stack || {};
                stack.message = stack.message || self.serialize(errorMessage);

                stack.line = stack.line || parseInt(width, 10) || null;
                stack.column = stack.column || parseInt(height, 10) || null;

                if (Object.prototype.toString.call(errorMessage) !== '[object Event]' || host) {
                    stack.file = stack.file || self.serialize(host);
                } else {
                    stack.file = (errorMessage.target || {}).src;
                }
                self.onError('window', stack);
            } catch (buffer) {
                self.onFault(buffer);
            }
            contextHandler.call(context, errorMessage, host, width, height, stack);
        };
    }
}
