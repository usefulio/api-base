Meteor.publish(null, function () {
	var fields = {};
	fields[API.options.apiName + "PersonalKey"] = 1;
	return Meteor.users.find(this.userId, {
		fields: fields
	});
});