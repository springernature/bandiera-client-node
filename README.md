
Bandiera Client (Node)
======================

This is a client for talking to the [Bandiera][bandiera] feature flagging service from a [Node.js]( http://nodejs.org) application.

This client currently only implements the read methods of the [Bandiera API](https://github.com/nature/bandiera/wiki/API-Documentation).

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

Each method of the client requires a callback. These callbacks accepts two arguments, the first is an error object or `null` the second contains the response.

Get features for all groups:

```js
client.getAll(function (err, groups) {
    /*
    groups = {
        'group name': [
            {group: 'group name', name: String, description: String, enabled: Boolean}, 
            ...
        ]   
    }
	 */
});
```

Get features for a group:

```js
client.getFeaturesForGroup('group name', function (err, features) {
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
client.getFeature('group name', 'feature name', function (err, feature) {
    /*
    feature = {group: 'group name', name: 'feature name', description: String, enabled: Boolean}
     */
});
```

Get the status of an individual feature:

```js
client.isEnabled('group name', 'feature name', function (err, enabled) {
	/*
    enabled = Boolean   
     */
});
```

Tests
-----

If you would like to contribute please make sure that the tests pass and that the code lints successfully. 

```sh
grunt       # Run the lint and test tasks together
grunt lint  # Run JSHint with the correct config
grunt test  # Run unit tests
```

License
-------

[Copyright 2014 Nature Publishing Group](LICENSE.txt).  
Bandiera is licensed under the [GNU General Public License 3.0][gpl].

[gpl]: http://www.gnu.org/licenses/gpl-3.0.html
[bandiera]: https://github.com/nature/bandiera
