:star: Star if you'd like to keep up to date on these packages.

These packages built and maintained by [Useful IO](http://useful.io).

# A Useful Meteor API foundation

The goal of this repository is to provide the fundamental
components needed to build and expose an API targeting
Meteor servers.

Specifically, it provides mechanisms for:

* creating and maintaining sets of public/private API keys
* creating and maintaining a per-client API key
* authenticating exposed Meteor methods
* authenticating exposed publications
* authenticating direct collection access
* automatically reconnecting to your API both on the server and the client

__Table of Contents__

- [Meteor API Fundamentals](#meteor-api-fundamentals)
- [API Server Base Package](#api-server-base-package)
    - [Usage](#usage)
    - [API](#api)
- [API Client Base Package](#api-client-base-package)
    - [Usage](#usage)
    - [API](#api)

__Folder Structure__

`packages/api-client`: Meteor package to use as a base for creating your own API client package

`packages/api-server`: Meteor package to use as a base for building your own API server

`examples/todo-server`: simple Meteor app demonstrating the use of the `useful:api-server` package to build an and expose a DDP-based API. This example server runs on `localhost:3000`, aliased to `my.api:3000` in order to satisfy Chrome's cross-origin policies, by default. You will need to edit your computer's `hosts` in order to link `my.api` to `127.0.0.1`.

`examples/packages/todo-api`: simple Meteor package demonstrating the use of the `useful:api-client` package to build a custom package that will connect to the `examples/server` api

`examples/client-app`: simple Meteor app demonstrating the use of the the custom api package in `examples/packages/todo-api` to connect and use the API exposed by `examples/todo-server`. This example client meteor app runs on `localhost:4000` and connects to the server running on `my.api:3000` by default.

# Meteor API Fundamentals

We need to agree on a few terms in order to understand how the API clients
and the API servers fit together.

__You__

This README is written for someone who wants to expose an API from their Meteor app, to be consumed by other Meteor apps. The API can encompass supporting method calls, publications and direct collection manipulation.

__Apps__

An `App` models one instance of a Meteor application that is going
to connect to your API.

Your API server will maintain a collection of `Apps`. Each `App` has its own
unique `public`, `private` key pair. When someone else connects to your
API server, they should use the `private` key to identify their server-side connection to your api server and the `public` key to identify their
client-side (browser/cordova) connections to your api server.

__Clients__

A `Client` models one `Meteor.user` of a Meteor application that
is going to connect to your API.

In addition to identifying which `App` is connecting to your API, you
might want to expose specific functionality to a particular user of that
3rd party `App`... for example, to show that 3rd party user all the 
documents you are maintaining that they created.

A `Client` is an particular user of an `App` that is registered with
your api. Each `Client` receives their own `personal` key, that along
with the `public` key for the `App` they belong to, will uniquely
identify them to your api server.

`Client`s and their `personal` keys are created for you automatically
as users register to the 3rd party Meteor application. This package
relies on `accounts-base` in order to do that.

# API Server Base Package

Under the hood, this package uses `jagi:astronomy` for extendability.

## Usage

In your API server, `meteor add useful:api-server`.

__A Note on API Extensibility__

You can extend what fields and methods are available on the `API.App`, 
`API.Client`, `API.Key`, `API.ClientKey` and `API.Identity` object by
calling `API.<Model>.extend({})` and passing in valid `jagi:astronomy` v2+ options.

## API

#### API.App
_client, server_

Container for the public and private keys that a 3rd party Meteor app
can use to connect to your API. Astronomy model.

Example:
```json
{
    "_id" : "ynjdPuBeAGkfQ8PkZ",
    "key" : {
        "public" : "public-7_gZ3TNdkMip5EgSlzhGFDaPT6ovhye_KBc0URhP-BE",
        "private" : "private-kOKNd9VZ3-_LVV1EzSUFHQc9zOWJRP0BqtahSKwdZ4d"
    }
}
```

#### <App instance>.regenerateKeys()
_client, server_

Reset the public/private key pair for this `App` instance. You still must call
`<App instance>.save()` to persist the change.

#### API.Client
_client, server_

Container for one `Meteor.user` of a 3rd party Meteor app that is using
your API. It mainly provides a way for you to trust that a browser client
using an `App`'s public key is authentic, because it will have its own
`personal` key as well. Astronomy model.

Example:
```js
{
    "_id" : "d6Sy4Mca9u4mL8hyr",
    "appId" : "t7Cv4itN8mFsY9tNd",
    "key" : {
        "personal" : "personal-Kir4tt-x3Qsgr63Y1GbNBhr6OrXGDMDm0l6A-FRbhYh"
    },
    "userId" : "GLLH6fFzrLRpxrXtP" // userId of the user in the 3rd party app
}
```

#### <Client instance>.regenerateKeys()
_client, server_

Reset the personal key pair for this `Client` instance. You still must call
`<Client instance>.save()` to persist the change.

#### API.Key
_client, server_

Model of the public/private key pair for an `App`. Astronomy model.

#### API.ClientKey
_client, server_

Model of the personal key for `Client`. Astronomy model.

#### API.Identity
_server only_

An object usually available as `this.connection.identity` within your code.  Astronomy model. By default, it has the following fields:

* `identity.appId` string _id of the App that this identity belongs to.
* `identity.clientId` string _id of the Client that this identity belongs to, if there is one (when connecting with a `private` key, this will be null).
* `identity.privileged` boolean, true if this identity corresponds to a `private` key, false otherwise.
* `identity.userId` returns the `userId` that this instance this identity belongs to in the 3rd party app.

And by default, it has the following methods:

* `identity.app()` returns the `App` instance this identity belongs to.
* `identity.client()` returns the `Client` instance this identity belongs to.

#### API.methods(options)
_server only_

`options` follows the same format as `Meteor.methods`, namely it should be an object of the form:

```js
{
    methodName: function(){ ... your method code ... }
}
```

If the client has not already identified itself, this will
automatically throw an `API.throwNotAuthorizedException()`.

Inside your method, `this.connection.identity` will refer
to an `API.Identity` instance, which you can use to check
if the request is coming from a 3rd party server or client.

#### API.publish(name, function)
_server only_

This follows the same format as `Meteor.publish`.

If the client has not already identified itself, this will
automatically throw an `API.throwNotAuthorizedException()`.

Inside your method, `this.connection.identity` will refer
to an `API.Identity` instance, which you can use to check
if the request is coming from a 3rd party server or client.
For example, you can use the `identity.appId` to modify any selectors to 
limit the publication to only documents owned by that `App`.

#### API.interceptCollection(Collection, options)
_server only_

Provide direct collection manipulation, e.g. `Collection.insert/update/remove`
for your API clients while still validating their API credentials and skipping
the limitations of `Collection.allow/deny`. You can perform any actions you
need to within the override functions you provide.

The __Collection__ is an instance of `Mongo.Collection` must have already been defined before this method is called on it.

The __options__ object allows you to selectively intercept specific operations for the collection. Each operation is optional, e.g. you can choose to override only the operations you care about, or all of them. The following options object overrides all operations:

```js
{
    insert: function (doc) {
        // do something and then insert the document
        // insert typically returns the _id of the inserted document
    }
    , update: function (selector, modifier, options) {
        // do something and then update the selected documents
        // update typically returns the number of affected documents
    }
    , remove: function (selector) {
        // do something and then remove the selected documents
        // remove typically returns the number of removed documents
    }
}
```

The original core Meteor method handlers that were overridden
by this function will be available as `Collection.originalMethods[operationName]` where `operationName` is one of `insert`, `update` or `remove`.

If the client has not already identified itself, this will
automatically throw an `API.throwNotAuthorizedException()`.

Inside your override methods, `this.connection.identity` will refer
to an `API.Identity` instance, which you can use to check
if the request is coming from a 3rd party server or client.
For example, you can use the `identity.appId` to modify any selectors to 
limit the operation to only documents owned by that `App`.

#### API.throwNotAuthorizedException()
_server only_

By default, this error is thrown when a connection to your API
server attempts to do something before identifying itself.
However, you can override this method to customize the error thrown.

# API Client Base Package

The API client package handles the fundamentals of connecting to and
authenticating with your API server that you pass to `API.config`. It is
intended to be used as a base for building your own package that your API's
clients will use to interact with whatever API you build.

It will handle automatic re-connects and re-authorization on both the
client and the server side of a 3rd party application once `.configure()`
is called.

The recommendation is to create your own namespace, like `MyAPI` and 
initially set it `= new API();`. Then you can expose additional functions/
capabilities off your `MyAPI` namespace that makes it easy to use your API
as you see fit.

> Note that your api consumer's server and browser applications will be able to use your API, but there is nothing about this package that makes anything reactive on the server-side. Reactivity is client-side only.

## Usage

Inside your own api client package you intend to publish: 
`api.use('useful:api-client');`.

At the very least, you will need to call `API.configure` in top-level code
in order to tell this package the location of your API server and what keys
it should use. You are however free to pull these keys from wherever you
like, e.g. `Meteor.settings`, environment variables, etc.

See `examples/packages/todo-api` for an example usage of this package.

## API

#### API.configure(options)
_client, server_

On the _server_, __options__ looks like:

```json
{
    "server": "(required) url of your api server, e.g. http://api.myapp.com or https://api.myapp.com"
    , "privateKey": "(required) private key for this app"
    , "apiName": "(required) presumably unique name of your api, alphanumeric only"
}
```

On the _client_, __options__ looks like:

```json
{
    "server": "(required) url of your api server, e.g. http://api.myapp.com or https://api.myapp.com"
    , "publicKey": "(required) public key for this app"
    , "apiName": "(required) presumably unique name of your api, alphanumeric only"
}
```

#### API.collection(name)

Creates and returns a new Mongo collection that uses this `API` instance's connection to the api server.

#### API.status()
_client, server_

Equivalent to `Meteor.status()`, but targets the connection to your api server.

#### API.call(...)
_client, server_

Equivalent to `Meteor.call`, but targets the connection to your api server.

#### API.apply(...)
_client, server_

Equivalent to `Meteor.apply`, but targets the connection to your api server.

#### API.subscribe(...)
_client, server_

Equivalent to `Meteor.subscribe`, but targets the connection to your api server.

#### API.disconnect()
_client, server_

Equivalent to `Meteor.disconnect`, but targets the connection to your api server.

#### API.reconnect()
_client, server_

Equivalent to `Meteor.reconnect`, but targets the connection to your api server.

