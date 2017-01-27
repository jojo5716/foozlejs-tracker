/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-shadow */
/* eslint-disable func-names */

const InitWatcher = (request, util, error, callback) => ({
    attempt(fn, scope) {
        try {
            const args = Array.prototype.slice.call(arguments, 2);
            return fn.apply(scope || this, args);
        } catch (err) {
            throw (error('catch', err), util.wrapError(err));
        }
    },

    configure(app) {
        return request.setCurrent(app);
    },

    track(err) {
        const message = callback(err);

        err = err || {};
        if (!err.stack) {
            try {
                throw Error(message);
            } catch (e) {
                err = e;
            }
        }
        error('direct', err);
    },

    watch(callback, scope) {
        return () => {
            try {
                const args = Array.prototype.slice.call(arguments, 0);
                return callback.apply(scope || this, args);
            } catch (err) {
                throw (error('catch', err), util.wrapError(err));
            }
        };
    },

    watchAll(obj) {
        const classes = Array.prototype.slice.call(arguments, 1);
        let name;

        for (name in obj) {
            if (typeof obj[name] === 'function' && util.contains(classes, name)) {
                const orig = obj[name];
                obj[name] = function () {
                    try {
                        const args = Array.prototype.slice.call(arguments, 0);
                        return orig.apply(this, args);
                    } catch (err) {
                        throw (error('catch', err), util.wrapError(err));
                    }
                };
            }
        }
        return obj;
    },

    hash: '9b37e9ac0b951d1cc4f7724bcd102d9edbc4a5d2',
    version: '1.0.3'
});

module.exports = {
    InitWatcher
};
