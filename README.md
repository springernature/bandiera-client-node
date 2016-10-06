
Bandiera Client (Node.js)
=========================

This is a client for talking to the [Bandiera][bandiera] feature flagging service from a [Node.js][node] application.
This client currently only implements the read methods of the [v2 Bandiera API][bandiera-api].

[![NPM version][shield-npm]][info-npm]
[![Node.js version support][shield-node]][info-node]
[![Build status][shield-build]][info-build]
[![Dependencies][shield-dependencies]][info-dependencies]
[![MIT licensed][shield-license]][info-license]
[![Known Vulnerabilities](https://snyk.io/test/github/springernature/bandiera-client-node/3fc231c72dea27100d49f6d5b5fb851b71083e7a/badge.svg)](https://snyk.io/test/github/springernature/bandiera-client-node/3fc231c72dea27100d49f6d5b5fb851b71083e7a)


Installation
------------

```sh
npm install bandiera-client
```

or add `bandiera-client` to your `package.json` file.


Usage
-----

Create an instance of the bandiera client:

```js
var bandiera = require('bandiera-client');
var client = bandiera.createClient('http://your-bandiera-server.com');
```

Each method of the client requires a callback. These callbacks accept two arguments, the first is an error object or `null` the second contains the response.

In the examples below, `params` is an object containing query parameters to send as part of the request to Bandiera. This argument is optional in all of the client methods. See the [API documentation][bandiera-api] for available parameters.

Get features for all groups:

```js
client.getAll(params, function (error, groups) {
    /*
    groups == {
        group_name: {
            feature_name: Boolean,
            ...
        },
        ...
    }
    */
});

// or

client.getAll(function (error, groups) {
    // ...
});
```

Get features for a group:

```js
client.getFeaturesForGroup('group_name', params, function (error, features) {
    /*
    features == {
        feature_name: Boolean,
        ...
    }
    */
});

// or

client.getFeaturesForGroup('group_name', function (error, features) {
    // ...
});
```

Get an individual feature:

```js
client.getFeature('group_name', 'feature_name', params, function (error, feature) {
    /*
    feature = Boolean
    */
});

// or

client.getFeature('group_name', 'feature_name', function (error, feature) {
    // ...
});
```


Options
-------

The Node.js Bandiera client also accepts options in construction which allow you to tweak the client's behaviour:

```js
var client = bandiera.createClient('http://your-bandiera-server.com', {
    // options go here
});
```

### `logger.debug` (function)

A logging function which will be called with debug messages. This should accept the same arguments as `console.log`. Defaults to an empty function.

### `logger.warn` (function)

A logging function which will be called with warning messages. This should accept the same arguments as `console.log`. Defaults to an empty function.

### `timeout` (number)

A timeout (in milliseconds) after which an API request should fail. Defaults to `400`.


Contributing
------------

If you would like to contribute please make sure that the tests pass and that the code lints successfully.

```sh
make lint test
```


License
-------

Copyright &copy; 2015 Springer Nature.  
Node Bandiera client is licensed under the [MIT License][info-license].



[bandiera]: https://github.com/nature/bandiera
[bandiera-api]: https://github.com/nature/bandiera/wiki/API-Documentation
[node]: http://nodejs.org

[info-dependencies]: https://gemnasium.com/springernature/bandiera-client-node
[info-license]: LICENSE
[info-node]: package.json
[info-npm]: https://www.npmjs.com/package/bandiera-client
[info-build]: https://travis-ci.org/springernature/bandiera-client-node
[shield-dependencies]: https://img.shields.io/gemnasium/springernature/bandiera-client-node.svg
[shield-license]: https://img.shields.io/badge/license-MIT-blue.svg
[shield-node]: https://img.shields.io/badge/node.js%20support-0.10–5-brightgreen.svg
[shield-npm]: https://img.shields.io/npm/v/bandiera-client.svg
[shield-build]: https://img.shields.io/travis/springernature/bandiera-client-node/master.svg
