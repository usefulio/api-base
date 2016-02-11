_.extend(API, {
	Identity: Identity
	, _interpolateMethodName: function(collectionName, operation) {
		return "/" + collectionName + "/" + operation;
	}
	, throwNotAuthorizedException: function () {
		throw new Meteor.Error('not-authorized', 'You are not authorized to use this API, please identify yourself first.');
	}
	, methods: function (definitions) {
		_.each(definitions, function (method, name) {
			definitions[name] = function () {
				if(!this.connection.identity) API.throwNotAuthorizedException();
				return method.apply(this, arguments);
			};
		});
		Meteor.methods(definitions);
	}
	, publish: function (name, publication) {
		Meteor.publish(name, function () {
			if(!this.connection.identity) API.throwNotAuthorizedException();
			return publication.apply(this, arguments);
		});
	}
	, interceptCollection: function (Collection, options) {
		var name = Collection._name;

		Collection.originalMethods = {};

		_.each(['insert', 'update', 'remove'], function (operation) {
			var methodName = API._interpolateMethodName(name, operation)
			if (_.isFunction(options[operation])) {
				Collection.originalMethods[operation] = Meteor.server.method_handlers[methodName];
				Meteor.server.method_handlers[methodName] = function () {
					if(!this.connection.identity) API.throwNotAuthorizedException();
					return options[operation].apply(this, arguments);
				};
			}
		});
	}
});