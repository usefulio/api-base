Package.describe({
  name: 'useful:api-server',
  version: '0.1.1',
  // Brief, one-line summary of the package.
  summary: 'Base package for building a DDP-API server that communicates with a `useful:api-client` client.',
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
    , 'mongo'
    , 'random'
    , 'underscore'
  ]);
  api.use(['jagi:astronomy@2.0.0-rc.4']);
  
  api.addFiles([
    'lib/models/lib/key.js'
    , 'lib/models/lib/clientKey.js'
    , 'lib/models/app.js'
    , 'lib/models/client.js'
    , 'lib/api.js'
  ], ['client','server']);

  api.addFiles([
    'server/models/lib/identity.js'
    , 'server/methods/identifyClient.js'
    , 'server/methods/identifyServer.js'
    , 'server/methods/registerClient.js'
    , 'server/api.js'
  ], 'server');

  api.export('API');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('useful:api-server');
  api.addFiles('api-server-tests.js');
});
