_.extend(API, {
	/**
		Client-side identification reactively re-runs when the connection
		to the api server resets, and if/when this client receives its
		personal client key.
	**/
	_identify: function () {
		// identify ourselves to the API Server
		Tracker.autorun(function () {
			var status = API.status()
				, user = Meteor.user()
				, options = API.options
				, personalKeyPropertyName = options.apiName + "PersonalKey";

			if (status.connected && options.publicKey) {
				API.apply('identifyClient', [options.publicKey, user && user[personalKeyPropertyName]], { wait: true }, function (err) {
					if(err && !_.isUndefined(console)){
						console.error('Error identifying self to API server.'); 
						console.error(err);
					}
				});
			}
		});
	}
});