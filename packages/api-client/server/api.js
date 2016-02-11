_.extend(API.prototype, {
	/**
		On the server, identify sets up an interval
		to check for disconnects to the API server and attempt
		to re-connect (which the DDP lib handles for us) and re-identify itself.
	**/
	_identify: function () {
		var self = this
			, options = self.options;

		if(self._identificationIntervalId){
			Meteor.clearInterval(self._identificationIntervalId);
		}

		self._identificationIntervalId = Meteor.setInterval(function(){
			var status = self.status();
			if (status.connected) {
				if (self._needsToIdentify) {
					self.apply('identifyServer', [options.privateKey], { wait: true }, function (err) {
						if(err){
							self._needsToIdentify = true;
							console.error('Error identifying this server to API server.'); 
							console.error(err);
						}else{
							self._needsToIdentify = false;
						}
					});
				}
			}else{
				self._needsToIdentify = true;
			}
		}, 5000);
	}
	, registerClient: function (userId) {
		var options = this.options;
		this.apply('registerClient', [options.privateKey, userId], { wait: true }, function (err, result) {
			if(err){
				console.warn('Error registering API client for: ', userId, (err.reason || err.message));
			}else{
				var modifier = { $set: {} };
				modifier.$set[options.apiName + "PersonalKey"] = result;
				Meteor.users.update(userId, modifier);
			}
		});
	}
});

API.onInitialization(function (api) {
	api._identificationIntervalId = undefined;
	api._needsToIdentify = true;
});