Meteor.methods({
	identifyServer: function (privateKey) {
		var app = App.findOne({
			'key.private': privateKey
		});
		
		if(!app) API.throwNotAuthorizedException()

		this.connection.identity = new Identity({
			appId: app._id
			, privileged: true
			, connectionId: this.connection.id
		});
	}
});