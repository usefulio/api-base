Meteor.methods({
	identifyClient: function (publicKey, personalKey) {
		var app = App.findOne({ 'key.public': publicKey });

		if(!app) API.throwNotAuthorizedException()

		// if we have a personal key, we're matching
		// a client/browser (personalKey)
		var client = personalKey ? Client.findOne({
				appId: app._id
				, 'key.personal': personalKey
			}) : false;

		var identity = new Identity({
			appId: app._id
			, clientId: client ? client._id : null
			, userId: client ? client.userId : null
			, connectionId: this.connection.id
		});
		this.connection.identity = identity;
	}
});