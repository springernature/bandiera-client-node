
Bandiera Client (Node.js)
=========================

This is a client for talking to the [Bandiera][bandiera] feature flagging service from a [Node.js][node] application.
This client currently only implements the read methods of the [v2 Bandiera API][bandiera-api].

[![NPM version][shield-npm]][info-npm]
[![Node.js version support][shield-node]][info-node]
[![Build status][shield-build]][info-build]
[![Dependencies][shield-dependencies]][info-dependencies]
[![MIT licensed][shield-license]][info-license]


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

In the examples below, `params` is an object containing query parameters to send as part of the request to Bandiera. See the [API documentation][bandiera-api] for available parameters.

Get features for all groups:

```js
client.getAll(params, function (err, groups) {
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
```

Get features for a group:

```js
client.getFeaturesForGroup('group_name', params, function (err, features) {
    /*
    features == {
        feature_name: Boolean,
        ...
    }
    */
});
```

Get an individual feature:

```js
client.getFeature('group_name', 'feature_name', params, function (err, feature) {
    /*
    feature = Boolean
    */
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

### `log.debug` (function)

A logging function which will be called with debug messages. This should accept the same arguments as `console.log`. Defaults to an empty function.

### `log.warn` (function)

A logging function which will be called with warning messages. This should accept the same arguments as `console.log`. Defaults to an empty function.


Contributing
------------

If you would like to contribute please make sure that the tests pass and that the code lints successfully.

```sh
make lint test
```


License
-------

Copyright &copy; 2015 Nature Publishing Group.  
Node Bandiera client is licensed under the [MIT License][info-license].



[bandiera]: https://github.com/nature/bandiera
[bandiera-api]: https://github.com/nature/bandiera/wiki/API-Documentation
[node]: http://nodejs.org

[info-dependencies]: https://gemnasium.com/nature/bandiera-client-node
[info-license]: LICENSE
[info-node]: package.json
[info-npm]: https://www.npmjs.com/package/bandiera-client
[info-build]: https://travis-ci.org/nature/bandiera-client-node
[shield-dependencies]: https://img.shields.io/gemnasium/nature/bandiera-client-node.svg
[shield-license]: https://img.shields.io/badge/license-MIT-blue.svg
[shield-node]: https://img.shields.io/node/v/bandiera-client.svg?label=node.js%20support
[shield-npm]: https://img.shields.io/npm/v/bandiera-client.svg
[shield-build]: https://img.shields.io/travis/nature/bandiera-client-node/master.svg
