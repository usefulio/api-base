_.extend(API.prototype, {
	/**
		Client-side identification reactively re-runs when the connection
		to the api server resets, and if/when this client receives its
		personal client key.
	**/
	_identify: function () {
		var api = this;
		// identify ourselves to the API Server
		Tracker.autorun(function () {
			var status = api.status()
				, user = Meteor.user()
				, options = api.options
				, personalKeyPropertyName = options.apiName + "PersonalKey";

			if (status.connected && options.publicKey) {
				api.apply('identifyClient', [options.publicKey, user && user[personalKeyPropertyName]], { wait: true }, function (err) {
					if(err && !_.isUndefined(console)){
						console.error('Error identifying self to API server.'); 
						console.error(err);
					}
				});
			}
		});
	}
});