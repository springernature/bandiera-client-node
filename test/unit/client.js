/* global afterEach, beforeEach, describe, it */
/* jshint maxlen: false, maxstatements: false */
'use strict';

var assert = require('proclaim');
var mockery = require('mockery');
var pkg = require('../../package.json');
var sinon = require('sinon');

describe('client', function () {
	var bandiera, request;

	beforeEach(function () {
		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false,
			warnOnReplace: false
		});
		request = sinon.stub();
		mockery.registerMock('request', request);
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
			assert.isObject(new bandiera.Client('http://bandiera/api'));
		});

		describe('returned object', function () {
			var client;

			beforeEach(function () {
				client = new bandiera.Client('http://bandiera/api');
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
					client.get('/v2/all', {user_group: 'foo'}, {}, function () {
						assert.isTrue(request.calledOnce);
						assert.deepEqual(request.firstCall.args[0], {
							method: 'GET',
							uri: 'http://bandiera/api/v2/all',
							headers: {
								'User-Agent': 'Bandiera Node.js Client / ' + pkg.version
							},
							qs: {
								user_group: 'foo'
							},
							json: true
						});
						done();
					});
				});

				it('should callback with the expected arguments', function (done) {
					client.get('/v2/all', {}, {}, function (error, response) {
						assert.strictEqual(error, null);
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
					client.get('/v2/all', {}, {}, function (error) {
						assert.strictEqual(error, requestError);
						done();
					});
				});

				it('should callback the default response value', function (done) {
					var defaultResponse = {defaultResponse: true};
					client.get('/v2/all', {}, defaultResponse, function (error, response) {
						assert.strictEqual(response, defaultResponse);
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
					client.get('/v2/all', {statusCode: 200}, {}, function (error) {
						assert.isNotNull(error);
						assert.strictEqual(error.message, 'Request was unsuccessful');
						done();
					});
				});

				it('should callback the default response value', function (done) {
					var defaultResponse = {defaultResponse: true};
					client.get('/v2/all', {}, defaultResponse, function (error, response) {
						assert.strictEqual(response, defaultResponse);
						done();
					});
				});

			});

			describe('.get() when response is not valid JSON', function () {

				beforeEach(function () {
					request.yieldsAsync(null, {statusCode: 200}, 'foo');
				});

				it('should callback with the expected error', function (done) {
					client.get('/v2/all', {}, {}, function (error) {
						assert.isNotNull(error);
						assert.strictEqual(error.message, 'API responded with invalid JSON: non-object');
						done();
					});
				});

				it('should callback the default response value', function (done) {
					var defaultResponse = {defaultResponse: true};
					client.get('/v2/all', {}, defaultResponse, function (error, response) {
						assert.strictEqual(response, defaultResponse);
						done();
					});
				});

			});

			describe('.get() when response does not have the expected `response` property', function () {

				beforeEach(function () {
					request.yieldsAsync(null, {statusCode: 200}, {});
				});

				it('should callback with the expected error', function (done) {
					client.get('/v2/all', {}, {}, function (error) {
						assert.isNotNull(error);
						assert.strictEqual(error.message, 'API responded with invalid JSON: missing response property');
						done();
					});
				});

				it('should callback the default response value', function (done) {
					var defaultResponse = {defaultResponse: true};
					client.get('/v2/all', {}, defaultResponse, function (error, response) {
						assert.strictEqual(response, defaultResponse);
						done();
					});
				});

			});

			it('should have a `getAll` method', function () {
				assert.isFunction(client.getAll);
			});

			describe('.getAll()', function () {
				var parameters, callback;

				beforeEach(function () {
					parameters = {user_group: 'foo'};
					callback = sinon.spy();
					sinon.stub(client, 'get');
					client.getAll(parameters, callback);
				});

				afterEach(function () {
					client.get.restore();
				});

				it('should call `get` with the expected arguments', function () {
					assert.isTrue(client.get.withArgs('/v2/all', parameters, {}, callback).calledOnce);
				});

			});

			it('should have a `getFeaturesForGroup` method', function () {
				assert.isFunction(client.getFeaturesForGroup);
			});

			describe('.getFeaturesForGroup()', function () {
				var parameters, callback;

				beforeEach(function () {
					parameters = {user_group: 'foo'};
					callback = sinon.spy();
					sinon.stub(client, 'get');
					client.getFeaturesForGroup('foo', parameters, callback);
				});

				afterEach(function () {
					client.get.restore();
				});

				it('should call `get` with the expected arguments', function () {
					assert.isTrue(client.get.withArgs('/v2/groups/foo/features', parameters, {}, callback).calledOnce);
				});

			});

			it('should have a `getFeature` method', function () {
				assert.isFunction(client.getFeature);
			});

			describe('.getFeature()', function () {
				var parameters, callback;

				beforeEach(function () {
					parameters = {user_group: 'foo'};
					callback = sinon.spy();
					sinon.stub(client, 'get');
					client.getFeature('foo', 'bar', parameters, callback);
				});

				afterEach(function () {
					client.get.restore();
				});

				it('should call `get` with the expected arguments', function () {
					assert.isTrue(client.get.withArgs('/v2/groups/foo/features/bar', parameters, false, callback).calledOnce);
				});

			});

			it('should have an `isEnabled` method which aliases `getFeature`', function () {
				assert.isFunction(client.isEnabled);
			});

		});

		describe('returned object (with defaults)', function () {
			var client;

			beforeEach(function () {
				client = new bandiera.Client();
			});

			it('should have a `baseUri` of "http://localhost/api"', function () {
				assert.strictEqual(client.baseUri, 'http://localhost/api');
			});

		});

		describe('returned object (with no "/api" in URI)', function () {
			var client;

			beforeEach(function () {
				client = new bandiera.Client('http://bandiera');
			});

			it('should have a `baseUri` property with "/api" appended', function () {
				assert.strictEqual(client.baseUri, 'http://bandiera/api');
			});

		});

	});

});
