
Bandiera Client (Node)
======================

This is a client for talking to the [Bandiera][bandiera] feature flagging service from a [Node.js][node] application.
This client currently only implements the read methods of the [Bandiera API][bandiera-api].

**Current Version:** *2.0.0*  
**Node Support:** *0.10.x, 0.11.x*  
**License:** [GPL3][gpl]  
**Build Status:** [![Build Status][travis-img]][travis]


Installation
------------

```sh
npm install bandiera-client
```

or add `bandiera-client` to your `package.json` file.


Examples
--------

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
    groups = {
        'group name': [
            {group: 'group name', name: String, description: String, enabled: Boolean}, 
            ...
        ],
        ... 
    }
	 */
});
```

Get features for a group:

```js
client.getFeaturesForGroup('group name', params, function (err, features) {
	/*
    features = [
        {group: 'group name', name: String, description: String, enabled: Boolean}, 
        ...
    ]
     */
});
```

Get an individual feature:

```js
client.getFeature('group name', 'feature name', params, function (err, feature) {
    /*
    feature = {group: 'group name', name: 'feature name', description: String, enabled: Boolean}
     */
});
```

Get the status of an individual feature:

```js
client.isEnabled('group name', 'feature name', params, function (err, enabled) {
	/*
    enabled = Boolean   
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
Bandiera is licensed under the [GNU General Public License 3.0][gpl].



[bandiera]: https://github.com/nature/bandiera
[bandiera-api]: https://github.com/nature/bandiera/wiki/API-Documentation
[gpl]: http://www.gnu.org/licenses/gpl-3.0.html
[node]: http://nodejs.org
[travis]: https://travis-ci.org/nature/bandiera-client-node
[travis-img]: https://travis-ci.org/nature/bandiera-client-node.svg?branch=master
