/* eslint-disable no-underscore-dangle */
import Define from './Define';

(((win, doc) => {
    const defineObj = new Define(
        win._foozlejs || {},
        win,
        doc
    );
    win.foozlejs = defineObj.initAPI();
}))(window, document);
