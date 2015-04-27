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

			describe('.get() when request is successful', function () {

				beforeEach(function () {
					request.yieldsAsync(null, {statusCode: 200}, {
						response: {
							foo: 'bar'
						}
					});
				});

				it('should call `request` with the expected arguments', function (done) {
					client.get('/v2/all', {user_group: 'foo'}, function () {
						assert.isTrue(request.calledOnce);
						assert.deepEqual(request.firstCall.args[0], {
							method: 'GET',
							uri: 'http://bandiera/api/v2/all',
							qs: {
								user_group: 'foo'
							},
							json: true
						});
						done();
					});
				});

				it('should callback with the expected arguments', function (done) {
					client.get('/v2/all', {}, function (err, response) {
						assert.strictEqual(err, null);
						assert.deepEqual(response, {
							foo: 'bar'
						});
						done();
					});
				});

			});

			describe('.get() when request is unsuccessful', function () {
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

			describe('.get() when response has a non-200 status', function () {

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

			describe('.getAll()', function () {
				var params, callback;

				beforeEach(function () {
					params = {user_group: 'foo'};
					callback = sinon.spy();
					sinon.stub(client, 'get');
					client.getAll(params, callback);
				});

				afterEach(function () {
					client.get.restore();
				});

				it('should call `get` with the expected arguments', function () {
					assert.isTrue(client.get.withArgs('/v2/all', params, callback).calledOnce);
				});

			});

			it('should have a `getFeaturesForGroup` method', function () {
				assert.isFunction(client.getFeaturesForGroup);
			});

			describe('.getFeaturesForGroup()', function () {
				var params, callback;

				beforeEach(function () {
					params = {user_group: 'foo'};
					callback = sinon.spy();
					sinon.stub(client, 'get');
					client.getFeaturesForGroup('foo', params, callback);
				});

				afterEach(function () {
					client.get.restore();
				});

				it('should call `get` with the expected arguments', function () {
					assert.isTrue(client.get.withArgs('/v2/groups/foo/features', params, callback).calledOnce);
				});

			});

			it('should have a `getFeature` method', function () {
				assert.isFunction(client.getFeature);
			});

			describe('.getFeature()', function () {
				var params, callback;

				beforeEach(function () {
					params = {user_group: 'foo'};
					callback = sinon.spy();
					sinon.stub(client, 'get');
					client.getFeature('foo', 'bar', params, callback);
				});

				afterEach(function () {
					client.get.restore();
				});

				it('should call `get` with the expected arguments', function () {
					assert.isTrue(client.get.withArgs('/v2/groups/foo/features/bar', params, callback).calledOnce);
				});

			});

			it('should have an `isEnabled` method which aliases `getFeature`', function () {
				assert.isFunction(client.isEnabled);
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
