/* global afterEach, beforeEach, describe, it */
'use strict';

var extend = require('node.extend');
var pkg = require('../package.json');
var querystring = require('querystring');
var request = require('request');

exports = module.exports = {
	Client: BandieraClient,
	createClient: createClient,
	defaults: {
		logger: {
			debug: function () {},
			warn: function () {}
		},
		timeout: 400
	}
};

function createClient (baseUri, options) {
	return new exports.Client(baseUri, options);
}

function BandieraClient (baseUri, options) {
	this.options = defaultOptions(options);
	this.baseUri = sanitizeBaseUri(baseUri);
	this.logger = this.options.logger;
}

BandieraClient.version = pkg.version;

function sanitizeBaseUri (baseUri) {
	if (!baseUri) {
		baseUri = 'http://localhost';
	}
	if (!/\/api$/.test(baseUri)) {
		baseUri += '/api';
	}
	return baseUri;
}

function defaultOptions (options) {
	return extend(true, {}, exports.defaults, options);
}

BandieraClient.prototype.get = function (endpoint, parameters, defaultResponse, done) {
	var self = this;
	request({
		uri: this.baseUri + endpoint,
		method: 'GET',
		headers: {
			'User-Agent': 'Bandiera Node.js Client / ' + BandieraClient.version
		},
		qs: parameters,
		json: true,
		timeout: self.options.timeout
	}, function(error, response, body) {
		error = error || getResponseError(response, body);
		var queryParams = querystring.stringify(parameters) || 'none';
		if (error) {
			self.logger.warn(
				'[BandieraClient] calling "%s" with params "%s": %s',
				endpoint,
				queryParams,
				error.stack
			);
			return done(error, defaultResponse);
		}
		self.logger.debug(
			'[BandieraClient] calling "%s" with params "%s"',
			endpoint,
			queryParams
		);
		done(null, body.response);
	});
};

function getResponseError (response, responseBody) {
	if (response.statusCode !== 200) {
		return new Error('Request was unsuccessful: response status was ' + response.statusCode);
	}
	if (responseBody === null || Array.isArray(responseBody) || typeof responseBody !== 'object') {
		return new Error('API responded with invalid JSON: non-object');
	}
	if (typeof responseBody.response === 'undefined') {
		return new Error('API responded with invalid JSON: missing response property');
	}
	return null;
}

BandieraClient.prototype.getAll = function (parameters, done) {
	if (arguments.length === 1) {
		done = parameters;
		parameters = {};
	}
	this.get('/v2/all', parameters, {}, done);
};

BandieraClient.prototype.getFeaturesForGroup = function (group, parameters, done) {
	if (arguments.length === 2) {
		done = parameters;
		parameters = {};
	}
	this.get('/v2/groups/' + group + '/features', parameters, {}, done);
};

BandieraClient.prototype.getFeature = function (group, feature, parameters, done) {
	if (arguments.length === 3) {
		done = parameters;
		parameters = {};
	}
	this.get('/v2/groups/' + group + '/features/' + feature, parameters, false, done);
};

BandieraClient.prototype.isEnabled = BandieraClient.prototype.getFeature;
