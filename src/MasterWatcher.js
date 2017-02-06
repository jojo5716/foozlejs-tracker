/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */

import Config from './Config';
import ConsoleWatcher from './ConsoleWatcher';
import Customer from './Customer';
import Enviroment from './Enviroment';
import Transmitter from './Transmitter';
import Log from './Log';
import NetworkWatcher from './NetworkWatcher';
import VisitorWatcher from './VisitorWatcher';
import WindowWatcher from './WindowWatcher';

import { util, MetadataReport, InitWatcher } from './helpers/utils';

export default class MasterWatcher {
    constructor(token, win = {}, doc = {}) {

        try {
            this.window = win;
            this.document = doc;
            this.config = new Config(token);
            this.onFault = util.bind(this.onFault, this);
            this.onError = util.bind(this.onError, this);

            this.serialize = util.bind(this.serialize, this);
            this.transmitter = new Transmitter(this.config);
            this.log = new Log();
            this.api = new InitWatcher(this.config, util, this.onError, this.serialize);
            this.metadata = new MetadataReport(this.serialize);
            this.environment = new Enviroment(this.window);
            this.customer = new Customer(this.config, this.log, this.window, this.document);
            this.apiConsoleWatcher = new ConsoleWatcher(this.log, this.onError, this.onFault, this.serialize, this.api, this.config.defaults.console);
            this.windowConsoleWatcher = new ConsoleWatcher(this.log, this.onError, this.onFault, this.serialize, this.window, this.config.current.console);

            if (
                this.window,
                this.document,
                this.util,
                this.onError,
                this.onFault,
                this.serialize,
                this.config,
                this.transmitter,
                this.log,
                this.api,
                this.metadata,
                this.environment,
                this.customer,
                this.customer.token && (
                    this.apiConsoleWatcher,
                    this.config.current.enabled && (
                        this.windowConsoleWatcher,
                            util.isBrowserSupported()
                    )
                )
            ) {
                this.visitorWatcher = new VisitorWatcher(this.log, this.onError, this.onFault, this.document, this.config.current.visitor);
                this.networkWatcher = new NetworkWatcher(this.log, this.onError, this.onFault, this.window, this.config.current.network);
                this.windowWatcher = new WindowWatcher(this.onError, this.onFault, this.serialize, this.window, this.config.current.window);
            }

        } catch (command) {
            this.onFault(command);
        }
    }

    initAPI() {
        if (this.customer.token) {
            this.api.addMetadata = this.metadata.addMetadata;
            this.api.removeMetadata = this.metadata.removeMetadata;
            return this.api;
        }

        return undefined;

    }

    onError(NodeGenerator, args, options) {
        let active = false;

        return (() => {
            if (util.isBrowserSupported() && this.config.current.enabled) {
                try {
                    args = args || {};
                    options = options || {
                        bindStack: null,
                        bindTime: null,
                        force: false
                    };
                    const message = args.message || this.serialize(args, options.force);

                    if (message && message.indexOf) {
                        if (message.indexOf('FoozleJS Caught') !== -1) {
                            return;
                        }

                        if (active && message.indexOf('Script error') !== -1) {
                            active = false;
                            return;
                        }
                    }

                    const obj = util.extend({}, {
                        bindStack: options.bindStack,
                        bindTime: options.bindTime,
                        column: args.column || args.columnNumber,
                        console: this.windowConsoleWatcher.report(),
                        customer: this.customer.report(),
                        entry: NodeGenerator,
                        environment: this.environment.report(),
                        file: args.file || args.fileName,
                        line: args.line || args.lineNumber,
                        message,
                        metadata: this.metadata.report(),
                        network: this.networkWatcher ? this.networkWatcher.report() : null,
                        url: (this.window.location || '').toString(),
                        stack: args.stack,
                        timestamp: util.isoNow(),
                        visitor: this.visitorWatcher ? this.visitorWatcher.report() : null,
                        version: '1.0.12'
                    });

                    if (!options.force) {
                        try {
                            if (!this.config.current.onError(obj, args)) {
                                return;
                            }
                        } catch (e) {
                            obj.console.push({
                                timestamp: util.isoNow(),
                                severity: 'error',
                                message: e.message
                            });

                            setTimeout(() => {
                                this.onError('catch', e, {
                                    force: true
                                });
                            }, 0);
                        }
                    }

                    this.log.clear();

                    setTimeout(() => {
                        active = false;
                    });
                    active = true;
                    this.transmitter.sendError(obj, this.customer.token);
                } catch (e) {
                    this.onFault(e);
                }
            }
        })();
    }

    onFault(error) {
        const sysLogger = this.transmitter || new Transmitter();
        const customer = this.customer || {};
        const foozle = this.window ? this.window._foozlejs : {};

        error = error || {};

        error = {
            token: customer.token || foozle.token,
            file: error.file || error.fileName,
            msg: error.message || 'unknown',
            stack: (error.stack || 'unknown').substr(0, 500),
            url: this.window.location,
            v: '1.0.12',
            h: '9b37e9ac0b951d1cc4f7724bcd102d9edbc4a5d2',
            x: util.uuid()
        };
        sysLogger.sendTrackerFault(error);
    }

    serialize(obj, method) {
        if (this.config.current.serialize && !method) {
            try {
                return this.config.current.serialize(obj);
            } catch (err) {
                this.onError('catch', err, {
                    force: true
                });
            }
        }

        return this.config.defaults.serialize(obj);
    }
}
