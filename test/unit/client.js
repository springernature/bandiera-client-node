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
/* jshint maxlen: false, maxstatements: false */
'use strict';

var assert = require('proclaim');
var mockery = require('mockery');
var sinon = require('sinon');

describe('bandiera-client-node', function () {
	var bandiera;

	beforeEach(function () {
		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false,
			warnOnReplace: false
		});
		bandiera = require('../../lib/client');
	});

	afterEach(function () {
		mockery.disable();
	});

	it('should be an object', function () {
		assert.isObject(bandiera);
	});

	describe('.createClient()', function () {

		beforeEach(function () {
			sinon.spy(bandiera, 'Client');
		});

		afterEach(function () {
			bandiera.Client.restore();
		});

		it('should be a function', function () {
			assert.isFunction(bandiera.createClient);
		});

		it('should return a `bandiera.Client` instance', function () {
			assert.isInstanceOf(bandiera.createClient('foo'), bandiera.Client);
		});

		it('should create a `bandiera.Client` instance with the expected arguments', function () {
			bandiera.createClient('foo');
			assert.isTrue(bandiera.Client.calledWithNew());
			assert.isTrue(bandiera.Client.withArgs('foo').calledOnce);
		});

	});

	describe('.Client()', function () {

		it('should be a function', function () {
			assert.isFunction(bandiera.Client);
		});

		it('should return an object', function () {
			assert.isObject(new bandiera.Client('foo'));
		});

		describe('returned object', function () {
			var client;

			beforeEach(function () {
				client = new bandiera.Client('foo');
			});

			it('should have a `baseUri` property matching the baseUri it was constructed with', function () {
				assert.strictEqual(client.baseUri, 'foo');
			});

		});

	});

});
