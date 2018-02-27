module.exports = {
	serialize
};


function serialize(obj) {
	if (obj && typeof obj === 'string') {
		return obj;
	}

	if (typeof obj === 'number' && isNaN(obj)) {
		return 'NaN';
	}

	if (obj === '') {
		return 'Empty String';
	}

	let jsonObj;

	try {
		jsonObj = JSON.stringify(obj);
	} catch (c) {
		jsonObj = 'Unserializable Object';
	}

	if (jsonObj) {
		return jsonObj;
	}

	if (obj === undefined) {
		return 'undefined';
	}

	if (obj && obj.toString) {
		return obj.toString();
	}

	return 'unknown';
}