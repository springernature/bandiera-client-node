/* global afterEach, beforeEach, describe, it */
/* jshint maxlen: false, maxstatements: false */
'use strict';

var assert = require('proclaim');
var mockery = require('mockery');
var sinon = require('sinon');

describe('client', function () {
	var mod, request;

	beforeEach(function () {
		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false,
			warnOnReplace: false
		});
		request = sinon.stub();
		mockery.registerMock('request', request);
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
			assert.isObject(new mod.Client('http://bandiera/api'));
		});

		describe('returned object', function () {
			var client;

			beforeEach(function () {
				client = new mod.Client('http://bandiera/api');
			});

			it('should have a `baseUri` property matching the baseUri it was constructed with', function () {
				assert.strictEqual(client.baseUri, 'http://bandiera/api');
			});

			it('should have a `get` method', function () {
				assert.isFunction(client.get);
			});

			describe('#get() (successful)', function () {

				beforeEach(function () {
					request.yieldsAsync(null, {statusCode: 200}, {foo: 'bar'});
				});

				it('should call `request` with the expected arguments', function (done) {
					client.get('/v2/all', {user_group: 'foo'}, function () {
						assert.isTrue(request.calledOnce);
						assert.strictEqual(request.firstCall.args[0].uri, 'http://bandiera/api/v2/all');
						assert.isObject(request.firstCall.args[0].qs);
						assert.strictEqual(request.firstCall.args[0].qs.user_group, 'foo');
						assert.isTrue(request.firstCall.args[0].json);
						done();
					});
				});

				it('should callback with the expected arguments', function (done) {
					client.get('/v2/all', {}, function (err, body) {
						assert.strictEqual(err, null);
						assert.strictEqual(body.foo, 'bar');
						done();
					});
				});

			});

			describe('#get() (unsuccessful)', function () {
				var requestError;

				beforeEach(function () {
					requestError = new Error('foo');
					request.yieldsAsync(requestError, null, null);
				});

				it('should callback with the expected error', function (done) {
					client.get('/v2/all', {}, function (err) {
						assert.strictEqual(err, requestError);
						done();
					});
				});

			});

			describe('#get() (non-200 status)', function () {

				beforeEach(function () {
					request.yieldsAsync(null, {
						statusCode: 400
					}, null);
				});

				it('should callback with the expected error', function (done) {
					client.get('/v2/all', {}, function (err) {
						assert.isNotNull(err);
						assert.strictEqual(err.message, 'Request was unsuccessful');
						done();
					});
				});

			});

			it('should have a `getAll` method', function () {
				assert.isFunction(client.getAll);
			});

			describe('#getAll()', function () {

				beforeEach(function () {
					sinon.stub(client, 'get');
					client.get.yieldsAsync(null, {
						groups: [
							{
								name: 'foo',
								features: [
									{
										group: 'foo',
										name: 'bar',
										description: 'baz',
										enabled: true
									}
								]
							}
						]
					});
				});

				afterEach(function () {
					client.get.restore();
				});

				it('should call `get` with the expected arguments', function (done) {
					var params = {user_group: 'foo'};
					client.getAll(params, function () {
						assert.isTrue(client.get.withArgs('/v2/all', params).calledOnce);
						done();
					});
				});

				it('should callback with a map of groups to feature lists', function (done) {
					client.getAll({}, function (err, groups) {
						assert.isNull(err);
						assert.deepEqual(groups, {
							foo: [{
								group: 'foo',
								name: 'bar',
								description: 'baz',
								enabled: true
							}]
						});
						done();
					});
				});

			});

			it('should have a `getFeaturesForGroup` method', function () {
				assert.isFunction(client.getFeaturesForGroup);
			});

			describe('#getFeaturesForGroup()', function () {

				beforeEach(function () {
					sinon.stub(client, 'get');
					client.get.yieldsAsync(null, {
						features: [
							{
								group: 'foo',
								name: 'bar',
								description: 'baz',
								enabled: true
							}
						]
					});
				});

				afterEach(function () {
					client.get.restore();
				});

				it('should call `get` with the expected arguments', function (done) {
					var params = {user_group: 'foo'};
					client.getFeaturesForGroup('foo', params, function () {
						assert.isTrue(client.get.withArgs('/v2/groups/foo/features', params).calledOnce);
						done();
					});
				});

				it('should callback with a list of feature object', function (done) {
					client.getFeaturesForGroup('foo', {}, function (err, features) {
						assert.isNull(err);
						assert.isArray(features);
						assert.lengthEquals(features, 1);
						assert.strictEqual(features[0].group, 'foo');
						assert.strictEqual(features[0].name, 'bar');
						assert.strictEqual(features[0].description, 'baz');
						assert.strictEqual(features[0].enabled, true);
						done();
					});
				});

			});

			it('should have a `getFeature` method', function () {
				assert.isFunction(client.getFeature);
			});

			describe('#getFeature()', function () {

				beforeEach(function () {
					sinon.stub(client, 'get');
					client.get.yieldsAsync(null, {
						feature: {
							group: 'foo',
							name: 'bar',
							description: 'baz',
							enabled: true
						}
					});
				});

				afterEach(function () {
					client.get.restore();
				});

				it('should call `get` with the expected arguments', function (done) {
					var params = {user_group: 'foo'};
					client.getFeature('foo', 'bar', params, function () {
						assert.isTrue(client.get.withArgs('/v2/groups/foo/features/bar', params).calledOnce);
						done();
					});
				});

				it('should callback with a feature object', function (done) {
					client.getFeature('foo', 'bar', {}, function (err, feature) {
						assert.isNull(err);
						assert.strictEqual(feature.group, 'foo');
						assert.strictEqual(feature.name, 'bar');
						assert.strictEqual(feature.description, 'baz');
						assert.strictEqual(feature.enabled, true);
						done();
					});
				});

			});

			it('should have an `isEnabled` method', function () {
				assert.isFunction(client.isEnabled);
			});

			describe('#isEnabled()', function () {

				beforeEach(function () {
					sinon.stub(client, 'getFeature');
					client.getFeature.yieldsAsync(null, {
						group: 'foo',
						name: 'bar',
						description: 'baz',
						enabled: true
					});
				});

				afterEach(function () {
					client.getFeature.restore();
				});

				it('should call `getFeature` with the expected arguments', function (done) {
					var params = {user_group: 'foo'};
					client.isEnabled('foo', 'bar', params, function () {
						assert.isTrue(client.getFeature.withArgs('foo', 'bar', params).calledOnce);
						done();
					});
				});

				it('should callback with a boolean', function (done) {
					client.isEnabled('foo', 'bar', {}, function (err, status) {
						assert.isNull(err);
						assert.isTrue(status);
						done();
					});
				});

			});

		});

		describe('returned object (with defaults)', function () {
			var client;

			beforeEach(function () {
				client = new mod.Client();
			});

			it('should have a `baseUri` of "http://localhost/api"', function () {
				assert.strictEqual(client.baseUri, 'http://localhost/api');
			});

		});

		describe('returned object (with no "/api" in URI)', function () {
			var client;

			beforeEach(function () {
				client = new mod.Client('http://bandiera');
			});

			it('should have a `baseUri` property with "/api" appended', function () {
				assert.strictEqual(client.baseUri, 'http://bandiera/api');
			});

		});

	});

});
