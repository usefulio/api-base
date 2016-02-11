An example package showing how you can use `useful:api-server`
to build and expose your own DDP API to other Meteor apps.

To run, use the `./start` script.

This example provides an API that lets clients create Todo lists.

The file `todo-server-api.js` provides the server-side functionality of the classic Meteor Todos application, but via an API.

If you read through this file, you'll see usage of `API.publish`, `API.methods`, etc.

The file `todo-server.js` simply provides the backing to create and view the keys for new API `Apps`. At the moment, it is completely
unsecured (unlike the API itself). However, you would write the `App`
creation and managment UX the same as you would any other Meteor application. Think about when you sign up for an Stripe key, or a
Mailgun key, etc. that's the UX that would be served directly via this app's html interface.

This api server runs on port 3000.