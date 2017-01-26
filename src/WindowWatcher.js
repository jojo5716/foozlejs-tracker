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

        context.onerror = (errorMessage, host, width, height, stack = {}) => {
            try {
                stack.message = stack.message || '';
                this.serialize(errorMessage);
                stack.line = stack.line || parseInt(width, 10) || null;
                stack.column = stack.column || parseInt(height, 10) || null;

                if (Object.prototype.toString.call(errorMessage) !== '[object Event]' || host) {
                    stack.file = stack.file || this.serialize(host);
                } else {
                    stack.file = (errorMessage.target || {}).src;
                }
                this.onError('window', stack);
            } catch (buffer) {
                this.onFault(buffer);
            }
            contextHandler.call(context, errorMessage, host, width, height, stack);
        };
    }
}
