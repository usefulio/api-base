Package.describe({
  name: 'todo-api',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use([
    'ecmascript'
    , 'mongo'
    , 'underscore'
    , 'useful:api-client'
  ]);
  api.addFiles('todo-api.js');

  api.export('TodoAPI');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('todo-api');
  api.addFiles('todo-api-tests.js');
});
