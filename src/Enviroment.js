/* eslint-disable max-len */
/* eslint-disable no-empty */
/* eslint-disable no-restricted-syntax */

export default class Enviroment {
    constructor(win) {
        this.loadedOn = new Date().getTime();
        this.window = win;
    }

    discoverDependencies() {
        let name;
        const obj = {};
        if (this.window.jQuery && this.window.jQuery.fn && this.window.jQuery.fn.jquery) {
            obj.jQuery = this.window.jQuery.fn.jquery;
        }

        if (this.window.jQuery && this.window.jQuery.ui && this.window.jQuery.ui.version) {
            obj.jQueryUI = this.window.jQuery.ui.version;
        }

        if (this.window.angular && this.window.angular.version && this.window.angular.version.full) {
            obj.angular = this.window.angular.version.full;
        }

        for (name in this.window) {
            if (name !== '_foozlejs' &&
                name !== 'webkitStorageInfo' &&
                name !== 'webkitIndexedDB' &&
                name !== 'top' &&
                name !== 'parent' &&
                name !== 'frameElement') {
                try {
                    if (this.window[name]) {
                        const type = this.window[name].version || this.window[name].Version || this.window[name].VERSION;
                        if (typeof type === 'string') {
                            obj[name] = type;
                        }
                    }
                } catch (e) {}
            }
        }

        return obj;
    }

    report() {
        return {
            age: new Date().getTime() - this.loadedOn,
            dependencies: this.discoverDependencies(),
            userAgent: this.window.navigator.userAgent,
            viewportHeight: this.window.document.documentElement.clientHeight,
            viewportWidth: this.window.document.documentElement.clientWidth
        };
    }
}
