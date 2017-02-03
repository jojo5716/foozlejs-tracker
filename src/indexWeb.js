/* eslint-disable no-underscore-dangle */
import MasterWatcher from './MasterWatcher';

(((win, doc) => {
    const watcher = new MasterWatcher(
        win._foozlejs || {},
        win,
        doc
    );
    win.foozlejs = watcher.initAPI();
}))(window, document);
