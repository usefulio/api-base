Package.describe({
  name: 'useful:api-client',
  version: '0.1.1',
  // Brief, one-line summary of the package.
  summary: 'Base package for building a DDP-API client that communicates with a `useful:api-server` server.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/usefulio/api-base',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use([
    'ecmascript'
    , 'underscore'
    , 'ddp'
    , 'accounts-base'
    , 'browser-policy'
  ]);

  api.use([
    'tracker'
  ], 'client');

  api.addFiles([
    'lib/api.js'
  ], ['client','server']);

  api.addFiles([
    'client/api.js'
  ], 'client');

  api.addFiles([
    'server/api.js'
    , 'server/lib/autoRegisterUsers.js'
    , 'server/publications/autoPublishPersonalKey.js'
  ], 'server');

  api.export('API');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('useful:api-client');
  api.addFiles('api-client-tests.js');
});
