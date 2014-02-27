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

describe('feature', function () {
	var mod;

	beforeEach(function () {
		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false,
			warnOnReplace: false
		});
		mod = require('../../lib/feature');
	});

	afterEach(function () {
		mockery.disable();
	});

	it('should be an object', function () {
		assert.isObject(mod);
	});

	describe('.createFeature()', function () {

		beforeEach(function () {
			sinon.spy(mod, 'Feature');
		});

		afterEach(function () {
			mod.Feature.restore();
		});

		it('should be a function', function () {
			assert.isFunction(mod.createFeature);
		});

		it('should return a `Feature` instance', function () {
			assert.isInstanceOf(mod.createFeature({}), mod.Feature);
		});

		it('should create a `Feature` instance with the expected arguments', function () {
			var data = {
				name: 'foo'
			};
			mod.createFeature(data);
			assert.isTrue(mod.Feature.calledWithNew());
			assert.isTrue(mod.Feature.withArgs(data).calledOnce);
		});

	});

	describe('.Feature()', function () {

		it('should be a function', function () {
			assert.isFunction(mod.Feature);
		});

		it('should return an object', function () {
			assert.isObject(new mod.Feature({
				name: 'foo'
			}));
		});

		describe('returned object', function () {
			var feature;

			beforeEach(function () {
				feature = new mod.Feature({
					name: 'foo',
					group: 'bar',
					description: 'baz',
					enabled: true
				});
			});

			it('should have a `name` property matching the `name` option it was constructed with', function () {
				assert.strictEqual(feature.name, 'foo');
			});

			it('should have a `group` property matching the `group` option it was constructed with', function () {
				assert.strictEqual(feature.group, 'bar');
			});

			it('should have a `description` property matching the `description` option it was constructed with', function () {
				assert.strictEqual(feature.description, 'baz');
			});

			it('should have a `enabled` property matching the `enabled` option it was constructed with', function () {
				assert.isTrue(feature.enabled);
			});

		});

	});

});
