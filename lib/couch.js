//
// hook.io-couch hook - emit hook.io events based on your CouchDB _changes feed
//
var Hook = require('hook.io').Hook,
    follow = require('follow'),
    util = require('util');

var CouchHook = exports.CouchHook = function(options){

  var self = this;

  Hook.call(self, options);


  self.on('hook::ready', function(){

    self._start();

  });

};

// CouchHook inherits from Hook
util.inherits(CouchHook, Hook);

CouchHook.prototype._start = function(){

  var opts = {}; // Same options paramters as before
  var feed = new follow.Feed(opts);

  var self = this;


  // You can also set values directly.
  feed.db            = self['feed-db'];
  feed.since         = self['feed-since'];
  feed.heartbeat     = self['feed-heartbeat'];
  feed.inactivity_ms = self['feed-inactivity'];
  feed.include_docs  = self['feed-include-docs'];

  feed.filter = function(doc, req) {
    // req.query is the parameters from the _changes request.
    //console.log('Filtering for query: ' + JSON.stringify(req.query));

    /*

    //
    // Remark: You can perform abitrary logic on the doc and return false,
    // should you not want to emit the change event
    //
    
    if (doc.foo || doc.bar) {
      return false;
    }

    */

    return true;
  }

  feed.on('change', function(change) {

    var doc = change.doc;
    //
    // Remark: Attempt to pull out method and params from couch document, 
    // based on JSON-RPC v1.0
    //
    if (typeof doc.method === 'undefined') {

      //
      // Since we didn't find both `method` and `params`, emit the generic change event,
      // with the entire document
      //
      self.emit('couch::change', change);

    } else {
    
      //
      // Conforming to JSON-RPC 1.0, let's emit the hook.io event,
      // using `method` as the `event`, and `params` as the `data`
      //
      self.emit(doc.method, doc.params);

    }

  })

  feed.on('error', function(err) {
    self.emit('couch::error', err);
  })

  feed.follow();

};
