Meteor.startup(function () {
	var selector = {};
	selector[API.options.apiName + "PersonalKey"] = { $exists: false };
	Meteor.users.find(selector).observe({
		added: function newUserRegistration (user) {
			API.registerClient(user._id);
		}
	})
});