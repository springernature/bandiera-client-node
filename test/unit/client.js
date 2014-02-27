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

describe('client', function () {
	var mod;

	beforeEach(function () {
		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false,
			warnOnReplace: false
		});
		mod = require('../../lib/client');
	});

	afterEach(function () {
		mockery.disable();
	});

	it('should be an object', function () {
		assert.isObject(mod);
	});

	describe('.createClient()', function () {

		beforeEach(function () {
			sinon.spy(mod, 'Client');
		});

		afterEach(function () {
			mod.Client.restore();
		});

		it('should be a function', function () {
			assert.isFunction(mod.createClient);
		});

		it('should return a `mod.Client` instance', function () {
			assert.isInstanceOf(mod.createClient('foo'), mod.Client);
		});

		it('should create a `mod.Client` instance with the expected arguments', function () {
			mod.createClient('foo');
			assert.isTrue(mod.Client.calledWithNew());
			assert.isTrue(mod.Client.withArgs('foo').calledOnce);
		});

	});

	describe('.Client()', function () {

		it('should be a function', function () {
			assert.isFunction(mod.Client);
		});

		it('should return an object', function () {
			assert.isObject(new mod.Client('foo'));
		});

		describe('returned object', function () {
			var client;

			beforeEach(function () {
				client = new mod.Client('foo');
			});

			it('should have a `baseUri` property matching the baseUri it was constructed with', function () {
				assert.strictEqual(client.baseUri, 'foo');
			});

		});

	});

});
