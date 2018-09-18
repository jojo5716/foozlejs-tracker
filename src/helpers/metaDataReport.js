/* eslint-disable no-restricted-syntax */

const MetadataReport = (filter) => {
    const obj = {};

    return {
        addMetadata(key, value) {
            obj[key] = value;
        },
        removeMetadata(name) {
            delete obj[name];
        },
        report() {
            return obj;
        },
        store: obj
    };
};

module.exports = {
    MetadataReport
};
