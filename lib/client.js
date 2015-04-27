/* global afterEach, beforeEach, describe, it */
'use strict';

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
		qs: params,
		json: true
	}, function(err, res, body) {
		if (err) {
			return done(err, {});
		}
		if (res.statusCode !== 200) {
			return done(new Error('Request was unsuccessful'), {});
		}
		done(null, body);
	});
};

BandieraClient.prototype.getAll = function (params, done) {
	this.get('/v2/all', params, function(err, body) {
		if (err) {
			return done(err, body);
		}
		done(err, body.response);
	});
};

BandieraClient.prototype.getFeaturesForGroup = function (group, params, done) {
	this.get('/v2/groups/' + group + '/features', params, function (err, body) {
		done(err, body.response);
	});
};

BandieraClient.prototype.getFeature = function (group, feature, params, done) {
	this.get('/v2/groups/' + group + '/features/' + feature, params, function (err, body) {
		done(err, body.response);
	});
};

BandieraClient.prototype.isEnabled = BandieraClient.prototype.getFeature;
