/* eslint-disable no-nested-ternary */
/* eslint-disable no-useless-escape */
/* eslint-disable max-len */

import { util } from './helpers/utils';


export default class VisitorWatcher {
    constructor(log, onError, onFault, document, options) {
        this.log = log;
        this.onError = onError;
        this.onFault = onFault;
        this.options = options;
        this.document = document;
        if (options.enabled) this.initialize(document);
    }

    initialize(el) {
        const fn = util.bind(this.onDocumentClicked, this);
        const cancel = util.bind(this.onInputChanged, this);

        if (el.addEventListener) {
            el.addEventListener('click', fn, true);
            el.addEventListener('blur', cancel, true);
        } else if (el.attachEvent) {
            el.attachEvent('onclick', fn);
            el.attachEvent('onfocusout', cancel);
        }
    }

    onDocumentClicked(css) {
        try {
            const elem = VisitorWatcher.getElementFromEvent(css);

            if (elem && elem.tagName) {
                if (VisitorWatcher.isDescribedElement(elem, 'a') ||
                    VisitorWatcher.isDescribedElement(elem, 'button') ||
                    VisitorWatcher.isDescribedElement(elem, 'input', ['button', 'submit'])
                ) {
                    this.writeVisitorEvent(elem, 'click');
                } else if (VisitorWatcher.isDescribedElement(elem, 'input', ['checkbox', 'radio'])) {
                    this.writeVisitorEvent(elem, 'input', elem.value, elem.checked);
                }
            }
        } catch (command) {
            this.onFault(command);
        }
    }

    onInputChanged(css) {
        try {
            const elem = VisitorWatcher.getElementFromEvent(css);
            if (elem && elem.tagName) {
                if (VisitorWatcher.isDescribedElement(elem, 'textarea')) {
                    this.writeVisitorEvent(elem, 'input', elem.value);

                } else if (VisitorWatcher.isDescribedElement(elem, 'select')) {
                    if (elem.options && elem.options.length) {
                        this.onSelectInputChanged(elem);
                    }

                } else if (
                    VisitorWatcher.isDescribedElement(elem, 'input') &&
                    !VisitorWatcher.isDescribedElement(elem, 'input', ['button', 'submit', 'hidden', 'checkbox', 'radio'])
                ) {
                    this.writeVisitorEvent(elem, 'input', elem.value);
                }
            }
        } catch (command) {
            this.onFault(command);
        }
    }

    onSelectInputChanged(select) {
        if (select.multiple) {
            for (let j = 0; j < select.options.length; j += 1) {
                if (select.options[j].selected) {
                    this.writeVisitorEvent(select, 'input', select.options[j].value);
                } else if (select.selectedIndex >= 0 && select.options[select.selectedIndex]) {
                    this.writeVisitorEvent(select, 'input', select.options[select.selectedIndex].value);
                }
            }
        }
    }

    writeVisitorEvent(element, elementType, value, iterations) {
        if (VisitorWatcher.getElementType(element) === 'password') {
            value = undefined;
        }

        this.log.add('v', {
            timestamp: util.isoNow(),
            action: elementType,
            value: this.options.input ? elementType !== 'password' ? value : null : null,
            element: {
                tag: element.tagName.toLowerCase(),
                attributes: VisitorWatcher.getElementAttributes(element),
                value: VisitorWatcher.getMetaValue(value, iterations)
            }
        });
    }

    static getElementFromEvent(domEvent) {
        return domEvent.target || domEvent.elementFromPoint(domEvent.clientX, domEvent.clientY);
    }

    static isDescribedElement(el, i, arr) {
        if (el.tagName.toLowerCase() !== i.toLowerCase()) {
            return false;
        }

        if (!arr) {
            return true;
        }

        el = VisitorWatcher.getElementType(el);
        for (i = 0; i < arr.length; i += 1) {
            if (arr[i] === el) {
                return true;
            }
        }
        return false;
    }

    static getElementType(el) {
        return (el.getAttribute('type') || '').toLowerCase();
    }

    static getElementAttributes(item) {
        const attributes = {};
        for (let i = 0; i < item.attributes.length; i += 1) {
            if (item.attributes[i].name.toLowerCase() !== 'value') {
                attributes[item.attributes[i].name] = item.attributes[i].value;
            }
        }

        return attributes;
    }

    static getMetaValue(w, iterations) {
        return w === undefined ? undefined : {
            length: w.length,
            pattern: VisitorWatcher.matchInputPattern(w),
            checked: iterations
        };
    }

    static matchInputPattern(str) {
        let input = '';

        if (str === '') {
            input = 'empty';
        } else {
            input = /^[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(str) ? 'email' : /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(str) || /^(\d{4}[\/\-](0?[1-9]|1[012])[\/\-]0?[1-9]|[12][0-9]|3[01])$/.test(str) ? 'date' : /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/.test(str) ? 'usphone' : /^\s*$/.test(str) ? 'whitespace' : /^\d*$/.test(str) ? 'numeric' : /^[a-zA-Z]*$/.test(str) ? 'alpha' : /^[a-zA-Z0-9]*$/.test(str) ? 'alphanumeric' : 'characters';
        }
        return input;
    }

    report() {
        return this.log.all('v');
    }
}
