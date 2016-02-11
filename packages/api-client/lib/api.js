API = function () {
	var self = this;

	self.connection = undefined;

	_.each(API._initializationHooks, function (hook) {
		hook(self);
	});
};
API.prototype.configure = function (options) {
	var self = this;
	
	self.options = options || {};

	if(!options.server) throw new Meteor.Error('missing-api-server-url', 'You must specify an api server url under `server` in the options for API.configure().');
	if(!options.apiName) throw new Meteor.Error('missing-api-name', 'You must specify a name for your api under `apiName` in the options for API.configure().');

	self.connection = DDP.connect(options.server);
	
	_.each(['subscribe', 'call', 'apply', 'status', 'reconnect', 'disconnect'], function (name) {
		self[name] = _.bind(self.connection[name], self.connection);
	});

	self._identify();
};

API._initializationHooks = [];
API.onInitialization = function (hook) {
	API._initializationHooks.push(hook);
};
