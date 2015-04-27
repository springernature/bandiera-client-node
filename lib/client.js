/* global afterEach, beforeEach, describe, it */
'use strict';

var pkg = require('../package.json');
var request = require('request');

exports = module.exports = {
	Client: BandieraClient,
	createClient: createClient
};

function createClient (baseUri) {
	return new exports.Client(baseUri);
}

function BandieraClient (baseUri) {
	this.baseUri = sanitizeBaseUri(baseUri);
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

BandieraClient.prototype.get = function (endpoint, params, done) {
	request({
		uri: this.baseUri + endpoint,
		method: 'GET',
		headers: {
			'User-Agent': 'Bandiera Node.js Client / ' + BandieraClient.version
		},
		qs: params,
		json: true
	}, function(error, res, body) {
		error = error || getResponseError(res, body);
		if (error) {
			return done(error, {});
		}
		done(null, body.response);
	});
};

function getResponseError (response, responseBody) {
	if (response.statusCode !== 200) {
		return new Error('Request was unsuccessful');
	}
	if (responseBody === null || Array.isArray(responseBody) || typeof responseBody !== 'object') {
		return new Error('API responded with invalid JSON: non-object');
	}
	if (typeof responseBody.response === 'undefined') {
		return new Error('API responded with invalid JSON: missing response property');
	}
	return null;
}

BandieraClient.prototype.getAll = function (params, done) {
	this.get('/v2/all', params, done);
};

BandieraClient.prototype.getFeaturesForGroup = function (group, params, done) {
	this.get('/v2/groups/' + group + '/features', params, done);
};

BandieraClient.prototype.getFeature = function (group, feature, params, done) {
	this.get('/v2/groups/' + group + '/features/' + feature, params, done);
};

BandieraClient.prototype.isEnabled = BandieraClient.prototype.getFeature;
