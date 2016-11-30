koa-browser-sync
================

[BrowserSync](http://browsersync.io/) middleware for [Koa](http://koajs.com/).

Use this middleware to automatically inject the necessary `browser-sync` snippet into your HTML pages.

Installation
-------------

```shell
npm install koa-browser-sync --save-dev
```


Usage
-------------
There is two ways to use this module.


####1) Start `browser-sync` and inject the snippet with `init: true` (This option is set to false by default).

See the [BrowserSync docs](https://browsersync.io/docs/options/) for initialization options.

```js
var koa = require('koa');
var app = koa();

if (app.env == 'development') {
  // Use init option to start the server, default: false
  // Other options are passed directly to browser-sync
  // ex: {init:true, files: ["app/css/**/*.css"], logConnections: false}
  app.use(require('koa-browser-sync')({init: true}));
}

app.use(function *(){
  this.body = '<html><body>Hello World</body></html>';
});

app.listen(3000);
```


####2) Get the snippet from BROWSERSYNC_SNIPPET environment variable (usefull to start `browser-sync` from a build tool like gulp, grunt, etc)

```js
var koa = require('koa');
var app = koa();

if (app.env == 'development') {
  // No options or {init: false}
  // The snippet must be provide by BROWSERSYNC_SNIPPET environment variable
  app.use(require('koa-browser-sync')();
}

app.use(function *(){
  this.body = '<html><body>Hello World</body></html>';
});

app.listen(3000);
```

Notes
-------------
- All the options are passed directly to `browser-sync`.
- Injection only happens on responses with a Content-Type header of `text/html` and containing a closing body tag `</body>`.


Licence
-------------
[MIT License](http://www.opensource.org/licenses/mit-license.php)


Author
-------------
[Simon Degraeve](https://github.com/SimonDegraeve)
