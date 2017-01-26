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
            const index = [];
            let i;
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    index.push({
                        key: i,
                        value: filter(obj[i])
                    });
                }
            }
            return index;
        },
        store: obj
    };
};

module.exports = {
    MetadataReport
};
