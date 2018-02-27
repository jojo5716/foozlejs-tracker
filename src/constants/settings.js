import serializer from '../helpers/serializer';


module.exports = {
	initialChecks,
	defaultSettings
};


function initialChecks() {
	return {
		cookie: true,
		enabled: true,
		token: true,
		callback: {
			enabled: false
		},
		console: {
			enabled: true
		},
		network: {
			enabled: true
		},
		visitor: {
			enabled: true,
			input: false
		},
		window: {
			enabled: true,
			promise: true
		}
	};
}


function defaultSettings() {
	return {
		application: '',
		cookie: false,
		enabled: true,
		errorURL: 'http://localhost:8000/api/v1/errors/capture',
		errorNoSSLURL: 'https://localhost:8000/api/v1/errors/capture',
		faultURL: 'http://localhost:8000/api/v1/errors/internal',
		onError: () => true,
		serialize: (obj) => serializer.serialize(obj),
		sessionId: '',
		token: '',
		userId: '',
		version: '',
		callback: {
			enabled: true,
			bindStack: false
		},
		console: {
			enabled: true,
			display: true,
			error: true,
			warn: false,
			watch: ['log', 'debug', 'info', 'warn', 'error']
		},
		network: {
			enabled: true,
			error: true
		},
		visitor: {
			enabled: true
		},
		usageURL: 'http://localhost:8000/api/v1/errors/image/capture',
		window: {
			enabled: true,
			promise: true
		}
	};
}
