
var thunkify       = require('thunkify');
var browserSync    = thunkify(require('browser-sync').init);
var StreamInjecter = require('stream-injecter');

module.exports = function(opts) {

  var bs, snippet;
  var opts       = opts || {};
  opts.init      = opts.init || false;
  opts.debugInfo = opts.debugInfo || false;

  return function*(next) {
    yield next;

    if (opts.init) {
      if (!bs) bs = yield browserSync(null, opts);
      snippet = bs[0].api.snippet
    } else {
      snippet = process.env.BROWSERSYNC_SNIPPET;
    }

    if (!snippet) return;

    if (!(this.response.type && ~this.response.type.indexOf("text/html"))) return;

    // Buffer
    if (Buffer.isBuffer(this.body)) {
      this.body = this.body.toString();
    }

    // String
    if (typeof this.body === 'string') {
      if (this.body.match(/client\/browser-sync-client/)) return;
      this.body = this.body.replace(/<\/body>/, snippet + '</body>');
    }

    // Stream
    if (this.body && typeof this.body.pipe === 'function') {
      var injecter = new StreamInjecter({
        matchRegExp: /(<\/body>)/,
        inject:      snippet,
        replace:     snippet + '$1',
        ignore:      /client\/browser-sync-client/
      });
      var size = +this.response.header['content-length'];
      if (size) this.set('Content-Length', size + snippet.length);
      this.body = this.body.pipe(injecter);
    }
  };
};
