// This file is part of bandiera-client-node.
// 
// bandiera-client-node is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// bandiera-client-node is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with bandiera-client-node.  If not, see <http://www.gnu.org/licenses/>.

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

BandieraClient.prototype.get = function (endpoint, done) {
	request({
		uri: this.baseUri + endpoint,
		method: 'GET',
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

BandieraClient.prototype.getAll = function (done) {
	this.get('/v1/all', function(err, body) {
		if (err) {
			return done(err, body);
		}
		var groups = body.groups.reduce(function (prev, curr) {
			prev[curr.name] = curr.features;
			return prev;
		}, {});
		done(err, groups);
	});
};

BandieraClient.prototype.getFeaturesForGroup = function (group, done) {
	this.get('/v1/groups/' + group + '/features', function (err, body) {
		done(err, body.features);
	});
};

BandieraClient.prototype.getFeature = function (group, feature, done) {
	this.get('/v1/groups/' + group + '/features/' + feature, function (err, body) {
		done(err, body.feature);
	});
};

BandieraClient.prototype.isEnabled = function (group, feature, done) {
	this.getFeature(group, feature, function (err, feature) {
		done(err, feature && feature.enabled);
	});
};
