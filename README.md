
Bandiera Client (Node)
======================

This is a client for talking to the [Bandiera][bandiera] feature flagging service from a [Node.js][node] application.
This client currently only implements the read methods of the [v2 Bandiera API][bandiera-api].

**Current Version:** *2.2.0*  
**Node Support:** *0.10.x, 0.12.x*  
**License:** [MIT][mit]  
**Build Status:** [![Build Status][travis-img]][travis]


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


Contributing
------------

If you would like to contribute please make sure that the tests pass and that the code lints successfully.

```sh
make lint test
```


License
-------

[Copyright 2014 Nature Publishing Group](LICENSE.txt).  
Node Bandiera client is licensed under the [MIT License][mit].



[bandiera]: https://github.com/nature/bandiera
[bandiera-api]: https://github.com/nature/bandiera/wiki/API-Documentation
[mit]: http://opensource.org/licenses/mit-license.php
[node]: http://nodejs.org
[travis]: https://travis-ci.org/nature/bandiera-client-node
[travis-img]: https://travis-ci.org/nature/bandiera-client-node.svg?branch=master
