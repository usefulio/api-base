Meteor.methods({
	registerClient: function(privateKey, userId, regenerateKey) {
		var app = App.findOne({'key.private': privateKey});
		if(!app){
			throw new Meteor.Error('unknown-app', 'The app you are attempting to register a user with is not registered.');
		}

		var client = Client.findOne({
				userId: userId
				, appId: app._id
			})
			, key;

		if(client){
			if(regenerateKey){
				client.regenerateKey();
				client.save();
			}
		}else{
			client = new Client({
				userId: userId
				, appId: app._id
			});
			client.save();
		}

		return client.key.personal;
	}
});