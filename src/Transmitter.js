/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-expressions */

import { util } from './helpers/utils';

export default class Transmitter {

    constructor(config) {
        this.config = config;
        this.disabled = false;
        this.throttleStats = {
            attemptCount: 0,
            throttledCount: 0,
            lastAttempt: new Date().getTime()
        };

        if (!window.JSON || !window.JSON.stringify) this.disabled = true;
    }

    errorEndpoint(className) {
        let cl = this.config.current.errorURL;
        if (!util.testCrossdomainXhr() || window.location.protocol.includes('https')) {
            cl = this.config.current.errorNoSSLURL;
        }
        return `${cl}?token=${className}`;
    }

    usageEndpoint(child) {
        return Transmitter.appendObjectAsQuery(child, this.config.current.usageURL);
    }

    trackerFaultEndpoint(child) {
        return Transmitter.appendObjectAsQuery(child, this.config.current.faultURL);
    }

    static appendObjectAsQuery(item, i) {
        i += '?';

        for (const key in item) {
            if (item[key]) {
                i += `${encodeURIComponent(key)}=${encodeURIComponent(item[key])}&`;
            }
        }
        return i;
    }

    static getCORSRequest(method, url) {
        let xhr;

        if (util.testCrossdomainXhr()) {
            xhr = new window.XMLHttpRequest();
            xhr.open(method, url);
            xhr.setRequestHeader('Content-Type', 'text/plain');
        } else if (typeof window.XDomainRequest !== 'undefined') {
            xhr = new window.XDomainRequest();
            xhr.open(method, url);
        } else {
            xhr = null;
        }

        return xhr;
    }

    sendUsage(inParams) {
        new Image().src = this.usageEndpoint(inParams);
    }

    sendError(message, object) {
        if (!this.disabled && !this.throttle(message)) {
            try {
                const xhr = Transmitter.getCORSRequest('POST', this.errorEndpoint(object));

                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status !== 200) this.disabled = true;
                };

                xhr._foozlejs = undefined;
                xhr.send(window.JSON.stringify(message));
            } catch (error) {
                this.disabled = true;
                throw error;
            }
        }
    }

    sendTrackerFault(message) {
        this.throttle(message) || (new Image().src = this.trackerFaultEndpoint(message));
    }

    throttle(delay) {
        const now = new Date().getTime();
        this.throttleStats.attemptCount += 1;

        if (this.throttleStats.lastAttempt + 1000 >= now) {

            this.throttleStats.lastAttempt = now;
            if (this.throttleStats.attemptCount > 10) {
                this.throttleStats.throttledCount += 1;
                return true;
            }
        } else {
            delay.throttled = this.throttleStats.throttledCount;
            this.throttleStats.attemptCount = 0;
            this.throttleStats.lastAttempt = now;
            this.throttleStats.throttledCount = 0;
        }

        return false;
    }
}
