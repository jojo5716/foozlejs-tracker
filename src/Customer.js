import { util } from './helpers/utils';

export default class Customer {
    constructor(config, log, win, doc) {
        this.config = config;
        this.log = log;
        this.window = win;
        this.document = doc;
        this.correlationId = this.token = null;
        this.initialize();
    }

    initialize() {
        this.token = this.getCustomerToken();
        this.correlationId = this.getCorrelationId();
    }

    getCustomerToken() {
        if (this.config.current.token) {
            return this.config.current.token;
        }
        return undefined;
    }

    getCorrelationId() {
        let name;

        if (!this.config.current.cookie) {
            return util.uuid();
        }

        try {
            name = this.document.cookie.replace(/(?:(?:^|.*;\s*)FoozleJS\s*=\s*([^;]*).*$)|^.*$/, '$1');
            if (!name) {
                name = util.uuid();
                this.document.cookie = `FoozleJS=${name}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
            }
        } catch (b) {
            name = util.uuid();
        }
        return name;
    }

    report() {
        return {
            application: this.config.current.application,
            correlationId: this.correlationId,
            sessionId: this.config.current.sessionId,
            token: this.token,
            userId: this.config.current.userId,
            version: this.config.current.version
        };
    }
}
