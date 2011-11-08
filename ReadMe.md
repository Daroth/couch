## hook.io-couch

*emit hook.io events based on your CouchDB _changes feed*

Built using the [Follow](https://github.com/iriscouch/follow) library by Jason Smith of [Iris Couch](http://www.iriscouch.com/)

## Installation

     git clone git@github.com:hookio/couch.git
     cd couch
     npm install
     node bin/couch

### Using NPM

    npm install hook.io-couch
    hookio-couch --debug

**Note: Using the default options hookio-couch will attempt to connect to http://localhost:5984/mydatabase**

## Hook Event Emitters

**couch::change** *event emitted when a document is changed*

**couch::error** *event emitted when there is an error in your changes feed*

`hook.io-couch` will also automatically detect CouchDB documents that conform to JSON-RPC 1.0. This means that a document that looks like this:

```js
{
   "_id": "002da93490105bfab4466a756c00286d",
   "_rev": "14-6b9d6eed98e045a9a34b65d62667a10e",
   "method": "hello",
   "params": {
       "foo": "bar"
   }
}
```

Will emit:

```js
hook.emit('hello', { "foo": "bar" });
```

## Hook config.json data

``` js
{
 "feed-db": "http://localhost:5984/mydatabase",
 "feed-since": "now",
 "feed-heartbeat": 3000,
 "feed-inactivity": 8640000,
 "feed-include-docs" : true
}
```